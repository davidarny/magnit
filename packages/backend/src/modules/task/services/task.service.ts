import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, In, Like, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import * as XLSX from "xlsx";
import { CannotSaveAnswersException } from "../../../shared/exceptions/cannot-save-answers.exception";
import { CannotSaveDuplicateAnswerException } from "../../../shared/exceptions/cannot-save-duplicate-answer.exception";
import { InvalidTaskStatusException } from "../../../shared/exceptions/invalid-task-status.exception";
import { TemplateAnswer } from "../../template/entities/template-answer.entity";
import { IPuzzle } from "../../template/entities/template.entity";
import { ITemplateService } from "../../template/interfaces/template.service.interface";
import { TemplateService } from "../../template/services/template.service";
import { ReportStageDto, ReportTemplateDto, TaskReportDto } from "../dto/task-report.dto";
import { TaskDto } from "../dto/task.dto";
import { ETaskStatus, Task } from "../entities/task.entity";
import { ITaskService, TTaskWithLastStageAndToken } from "../interfaces/task.service.interface";
import _ = require("lodash");

@Injectable()
export class TaskService implements ITaskService {
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @Inject(TemplateService) private readonly templateService: ITemplateService,
    ) {}

    async findTasksWithExpiringStages(): Promise<TTaskWithLastStageAndToken[]> {
        return await this.taskRepository.query(`
            SELECT
                t.*,
                json_agg(ts.*) ->> json_array_length(json_agg(ts.*)) - 1  as stage,
                json_agg(pt.token) ->> json_array_length(json_agg(pt.token)) - 1 as token
            FROM task_stage ts
            LEFT JOIN task t ON ts.id_task = t.id
            LEFT JOIN push_token pt ON t.id_assignee = pt.id_user
            WHERE EXTRACT(day FROM ts.deadline - date(now())) <= t.notify_before
            AND NOT(ts.finished)
            GROUP BY t.id, t.created_at, ts.created_at, pt.created_at
            ORDER BY t.created_at, ts.created_at, pt.created_at
        `);
    }

    async findAll(
        offset?: number,
        limit?: number,
        sortBy?: keyof TaskDto,
        sort?: "ASC" | "DESC",
        status?: ETaskStatus,
        statuses?: ETaskStatus[],
        title?: string,
    ) {
        // TODO: probably need to introduce FindOptionsBuilder
        const options: FindManyOptions<Task> = {};
        if (typeof offset !== "undefined") {
            options.skip = offset;
        }
        if (typeof limit !== "undefined") {
            options.take = limit;
        }
        if (sort) {
            options.order = { [sortBy || "title"]: sort };
        }
        if (status) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { status });
        }
        if (statuses) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { status: In(statuses) });
        }
        if (title) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { title: Like(`%${title}%`) });
        }
        return this.taskRepository.find(options);
    }

    async insert(task: Task) {
        // in case if insert() is called with existing task
        // semantics of this methods is about creating new onde
        delete task.id;
        return this.taskRepository.save(task);
    }

    async findById(id: string, relations: string[] = []) {
        return this.taskRepository.findOne({ where: { id }, relations });
    }

    async getTaskExtended(id: string) {
        const task = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.stages", "stage", "stage.id_task = :id", { id })
            .where("task.id = :id", { id })
            .orderBy("stage.created_at", "ASC")
            .getOne();
        const templates = await this.templateService.findByTaskId(task.id.toString());
        return { ...task, templates };
    }

    async getTaskStagesWithHistory(id: string): Promise<Task> {
        return this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.stages", "stage", "stage.id_task = :id", { id })
            .leftJoinAndSelect("stage.history", "history", "history.id_stage = stage.id")
            .where("task.id = :id", { id })
            .orderBy("stage.created_at", "ASC")
            .addOrderBy("history.created_at", "ASC")
            .getOne();
    }

    async deleteById(id: string) {
        await this.taskRepository.delete(id);
    }

    async update(id: string, task: Task): Promise<Task> {
        return this.taskRepository.save({ ...task, id: Number(id) });
    }

    @Transactional()
    async setTaskAnswers(
        taskId: string,
        templateIds: string[],
        files: Express.Multer.File[],
        body: { [key: string]: string },
    ) {
        const task = await this.taskRepository.findOne(taskId);
        // check if task has IN_PROGRESS status
        // if not, throw error
        if (task.status !== ETaskStatus.IN_PROGRESS) {
            throw new InvalidTaskStatusException("Cannot save answers");
        }
        // move task to COMPLETED status
        task.status = ETaskStatus.COMPLETED;
        await this.taskRepository.save(task);
        // get all template ids in keys
        const groupedTemplateIds = this.groupKeysBy(templateIds, id =>
            this.getTemplateIdFromMultipartKey(id),
        );
        await Promise.all(
            groupedTemplateIds.map(async templateId => {
                // group all key with array index suffix
                const puzzleIds = this.groupKeysBy(templateIds, id =>
                    this.getPuzzleIdFromMultipartKey(id),
                );
                await this.ensurePuzzlesSettled(taskId, puzzleIds);
                // remove id of comment suffix
                // cause we don't store that separately
                const templatePuzzleIds = this.getTemplatePuzzleIdsWithoutComments(
                    templateIds,
                    templateId,
                );
                const template = await this.templateService.findById(templateId);
                const puzzles = await this.templateService.findPuzzlesByIds(templateId, puzzleIds);
                // collect answers
                const answers = templatePuzzleIds
                    .map(templatePuzzleId => {
                        const puzzleId = this.getPuzzleIdFromMultipartKey(templatePuzzleId);
                        const puzzle = puzzles.get(puzzleId);
                        if (puzzle) {
                            // trying to get puzzle_type
                            const type = this.getPuzzleType(puzzle);
                            let filename = this.getFileName(files, templatePuzzleId);
                            if (filename) {
                                filename = `${process.env.BACKEND_HOST}/${filename}`;
                            }
                            const answer = filename || body[templatePuzzleId];
                            return new TemplateAnswer({
                                id_puzzle: puzzle.id,
                                answer,
                                template,
                                task,
                                answer_type: type,
                                // save comment if exists
                                comment: body[`${templateId}_${puzzleId}_comment`] || null,
                            });
                        }
                    })
                    .filter(Boolean);
                await this.templateService.insertAnswerBulk(answers);
            }),
        );
    }

    getDescriptionByTransition(
        prevStatus: ETaskStatus,
        nextStatus: ETaskStatus,
    ): string | undefined {
        // little state machine with possible transitions
        // between statuses
        return {
            [ETaskStatus.DRAFT]: {
                [ETaskStatus.IN_PROGRESS]: "Отправка задания",
            },
            [ETaskStatus.IN_PROGRESS]: {
                [ETaskStatus.ON_CHECK]: "Задание прислано на проверку",
                [ETaskStatus.COMPLETED]: "Этап завершён",
            },
            [ETaskStatus.ON_CHECK]: {
                [ETaskStatus.IN_PROGRESS]: "Отправка задания",
                [ETaskStatus.COMPLETED]: "Этап завершён",
            },
        }[prevStatus][nextStatus];
    }

    @Transactional()
    async getReport(id: string): Promise<[Task, TaskReportDto]> {
        const task = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.assignments", "assignment", "assignment.id_task = :id", { id })
            .leftJoinAndSelect("task.stages", "stage", "stage.id_task = :id", { id })
            .where("task.id = :id", { id })
            .orderBy("assignment.created_at", "ASC")
            .addOrderBy("stage.created_at", "ASC")
            .getOne();
        const templates = await this.templateService.findByTaskId(task.id.toString());
        const report = new TaskReportDto({
            ..._.omit(task, "assignments"),
            stages: task.stages.map(stage => {
                return new ReportStageDto({
                    ...stage,
                    templates: task.assignments
                        .map(assignment => {
                            const template = _.find(templates, { id: assignment.id_template });
                            if (!template) {
                                return;
                            }
                            return new ReportTemplateDto({
                                id: template.id,
                                title: template.title,
                                version: template.version,
                                updated_at: template.updated_at,
                                created_at: template.created_at,
                            });
                        })
                        .filter(Boolean),
                });
            }),
        });
        return [task, report];
    }

    getReportBuffer(report: TaskReportDto): Buffer {
        const ws = XLSX.utils.aoa_to_sheet([
            ["Дата создания", "Статус"],
            [report.created_at, report.status],
            ["Этапы работы"],
            ..._.flatMap(report.stages, stage => [
                [stage.title, stage.deadline],
                ["№", "Название шаблона", "Дата добавления", "Количество правок"],
                ..._.map(stage.templates, (template, index) => [
                    index,
                    template.title,
                    template.created_at,
                    template.version,
                ]),
            ]),
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, report.title);
        return XLSX.write(wb, { type: "buffer" });
    }

    private getFileName(files: Express.Multer.File[], templatePuzzleId) {
        return (
            files.find(file => file.fieldname === templatePuzzleId) || {
                filename: undefined,
            }
        ).filename;
    }

    private getPuzzleType(puzzle: IPuzzle): string | null {
        return (_.first(puzzle.puzzles) || { puzzle_type: null }).puzzle_type;
    }

    private getTemplateIdFromMultipartKey(id: string): string | undefined {
        return _.first(id.split("_"));
    }

    private getPuzzleIdFromMultipartKey(id: string): string | undefined {
        return _.nth(id.split("_"), 1);
    }

    private getTemplatePuzzleIdsWithoutComments(ids: string[], templateId: string): string[] {
        return ids.filter(id => id.startsWith(templateId) && !id.includes("comment"));
    }

    private async ensurePuzzlesSettled(taskId: string, puzzleIds: string[]): Promise<void> {
        // validating here cause pipe cannot get access
        // to file array and it's keys
        const promises = puzzleIds.map(async puzzleId => ({
            id: puzzleId,
            result: await this.templateService.findByPuzzleId(taskId, puzzleId),
        }));
        let results: Array<{ id: string; result?: TemplateAnswer }>;
        try {
            results = await Promise.all(promises);
        } catch (error) {
            throw new CannotSaveAnswersException("Cannot save answers");
        }
        for (const result of results) {
            if (result.result) {
                throw new CannotSaveDuplicateAnswerException(
                    `Cannot save duplicate answer with id "${result.id}"`,
                );
            }
        }
    }

    private groupKeysBy(ids: string[], predicate: (id: string) => string): string[] {
        return ids.reduce((prev, curr) => {
            const existing = prev.find(id => id === predicate(curr));
            if (existing) {
                return prev;
            }
            return [...prev, predicate(curr)];
        }, []);
    }
}
