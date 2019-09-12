import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { existsSync, unlinkSync } from "fs";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import * as XLSX from "xlsx";
import { AssetNotFoundException } from "../../../shared/exceptions/asset-not-found.exception";
import { CannotParseLocationException } from "../../../shared/exceptions/cannot-prase-location.location";
import { CannotSaveAnswersException } from "../../../shared/exceptions/cannot-save-answers.exception";
import { CannotSaveDuplicateAnswerException } from "../../../shared/exceptions/cannot-save-duplicate-answer.exception";
import { CannotSavePartialAnswersException } from "../../../shared/exceptions/cannot-save.partial-answers.exception";
import { InvalidTaskStatusException } from "../../../shared/exceptions/invalid-task-status.exception";
import { LocationNotFoundInBodyException } from "../../../shared/exceptions/location-not-found-in-body.exception";
import { TemplateNotFoundException } from "../../../shared/exceptions/template-not-found.exception";
import { TemplateAnswerLocationDto } from "../../template/dto/template-answer-location.dto";
import { TemplateAnswerLocation } from "../../template/entities/template-answer-location.entity";
import { TemplateAnswer } from "../../template/entities/template-answer.entity";
import { IPuzzle } from "../../template/entities/template.entity";
import { TemplateService } from "../../template/services/template.service";
import { ReportStageDto, ReportTemplateDto, TaskReportDto } from "../dto/task-report.dto";
import { TaskDto } from "../dto/task.dto";
import { TaskDocument } from "../entities/task-document.entity";
import { TaskStage } from "../entities/task-stage.entity";
import { ETaskStatus, Task } from "../entities/task.entity";
import { TemplateAssignment } from "../entities/tempalte-assignment.entity";
import _ = require("lodash");

export type TTaskWithLastStageAndToken = Task & { token: string; stage: TaskStage };

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskStage) private readonly taskStageRepository: Repository<TaskStage>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(TemplateAssignment)
        private readonly templateAssignmentRepository: Repository<TemplateAssignment>,
        @InjectRepository(TaskDocument)
        private readonly taskDocumentRepository: Repository<TaskDocument>,
        private readonly templateService: TemplateService,
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
        let sql = `
            SELECT
                t.id,
                t.title,
                t.description,
                t.status,
                t.id_owner,
                t.id_assignee,
                t.notify_before,
                t.created_at,
                t.updated_at
            FROM task t
            WHERE 1 = 1
        `;
        const params: Array<string | number> = [];
        if (!_.isNil(status)) {
            params.push(status);
            sql += ` AND t.status = $${params.length} `;
        }
        if (!_.isNil(statuses)) {
            params.push(`(${statuses.join(",")})`);
            sql += ` AND t.status IN $${params.length} `;
        }
        if (!_.isNil(title)) {
            params.push(`%${title.toLowerCase()}%`);
            sql += ` AND lower(t.title) LIKE $${params.length} `;
        }
        if (!_.isNil(sort)) {
            sql += ` ORDER BY t.${sortBy || "title"} ${sort} `;
        }
        if (!_.isNil(limit)) {
            params.push(limit);
            sql += ` LIMIT $${params.length} `;
        }
        if (!_.isNil(offset)) {
            params.push(offset);
            sql += ` OFFSET $${params.length} `;
        }
        return this.taskRepository.query(sql, params);
    }

    async insert(task: Task) {
        // in case if insert() is called with existing task
        // semantics of this methods is about creating new one
        delete task.id;
        return this.taskRepository.save(task);
    }

    async findById(id: number, relations: string[] = []) {
        return this.taskRepository.findOne({ where: { id }, relations });
    }

    @Transactional()
    async getTaskExtended(id: number) {
        const tasks = await this.taskRepository.query(
            `
                SELECT t.*,
                       to_json(array_remove(array_agg(DISTINCT ts), NULL)) AS stages,
                       to_json(array_remove(array_agg(DISTINCT td), NULL)) AS documents
                FROM task t
                LEFT JOIN
                    (
                        SELECT td.id,
                           td.id_task,
                           td.original_name,
                           td.created_at,
                           td.updated_at,
                           concat('${process.env.BACKEND_HOST}', '/', td.filename) AS filename
                        FROM task_document td
                    ) td ON td.id_task = t.id AND td.id_task = $1
                LEFT JOIN task_stage ts ON ts.id_task = t.id AND ts.id_task = $1
                WHERE t.id = $1
                GROUP BY t.id;
        `,
            [id],
        );
        const task = _.first<Task>(tasks);
        if (!task) {
            throw new InternalServerErrorException(`Cannot fetch task "${id}"`);
        }
        const templates = await this.templateService.findByTaskId(task.id);
        return { ...task, templates };
    }

    async getTaskStagesWithHistory(id: number): Promise<Task> {
        return this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.stages", "stage", "stage.id_task = :id", { id })
            .leftJoinAndSelect("stage.history", "history", "history.id_stage = stage.id")
            .where("task.id = :id", { id })
            .orderBy("stage.created_at", "ASC")
            .addOrderBy("history.created_at", "ASC")
            .getOne();
    }

    async deleteById(id: number) {
        await this.taskRepository.delete(id);
    }

    async update(id: number, task: DeepPartial<Task>): Promise<Task> {
        return this.taskRepository.save({ ...task, id });
    }

    @Transactional()
    async setTaskAnswers(
        id: number,
        keys: string[],
        files: Express.Multer.File[],
        body: { [key: string]: string },
    ) {
        const task = await this.taskRepository.findOne(id);
        // check if task has IN_PROGRESS status
        // if not, throw error
        if (task.status !== ETaskStatus.IN_PROGRESS) {
            throw new InvalidTaskStatusException(
                `Cannot save answers while task has status "${task.status}"`,
            );
        }
        if (!body.location) {
            throw new LocationNotFoundInBodyException("Location not found in body");
        }
        const templateAnswerLocationDto: Error | TemplateAnswerLocationDto = _.attempt(() =>
            JSON.parse(body.location),
        );
        if (templateAnswerLocationDto instanceof Error) {
            throw new CannotParseLocationException("Cannot parse location JSON");
        }
        const location = new TemplateAnswerLocation(templateAnswerLocationDto);
        await this.templateService.saveTemplateLocation(location);
        // get all template ids in keys
        const groupedTemplateIds = this.groupKeysBy(keys, key =>
            this.getTemplateIdFromMultipartKey(key),
        ).map(templateId => Number(templateId));
        await Promise.all(
            groupedTemplateIds
                .map(async templateId => {
                    // group all key with array index suffix
                    const puzzleIds = this.groupKeysBy(keys, key =>
                        this.getPuzzleIdFromMultipartKey(key),
                    );
                    await this.ensurePuzzlesSettled(id, puzzleIds);
                    // remove id of comment suffix
                    // cause we don't store that separately
                    const templatePuzzleIds = this.getTemplatePuzzleIdsWithoutComments(
                        keys,
                        templateId,
                    );
                    const template = await this.templateService.findById(templateId);
                    if (!template) {
                        throw new TemplateNotFoundException(`Template "${templateId}" not found`);
                    }
                    const puzzles = await this.templateService.findPuzzlesByIds(
                        template,
                        puzzleIds,
                    );
                    // TODO: correctly handle questions check
                    if (false) {
                        const allPuzzles = await this.templateService.findAllQuestions(template);
                        if (allPuzzles.length !== puzzleIds.length) {
                            throw new CannotSavePartialAnswersException(
                                "Cannot save answers partially",
                            );
                        }
                    }
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
                                const comment = body[`${templateId}_${puzzleId}_comment`];
                                if (_.isString(answer)) {
                                    return new TemplateAnswer({
                                        id_puzzle: puzzle.id,
                                        answer,
                                        template,
                                        location,
                                        task,
                                        answer_type: type,
                                        // save comment if exists
                                        comment: _.isString(comment) ? comment : null,
                                    });
                                }
                            }
                        })
                        .filter(Boolean);
                    await this.templateService.saveAnswerBulk(answers);
                })
                .filter(Boolean),
        );
        // move task to COMPLETED status
        task.status = ETaskStatus.ON_CHECK;
        await this.taskRepository.save(task);
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
            [ETaskStatus.EXPIRED]: {
                [ETaskStatus.IN_PROGRESS]: "Отправка задания",
                [ETaskStatus.COMPLETED]: "Этап завершён",
            },
            [ETaskStatus.ON_CHECK]: {
                [ETaskStatus.IN_PROGRESS]: "Отправка задания",
                [ETaskStatus.COMPLETED]: "Этап завершён",
            },
        }[prevStatus][nextStatus];
    }

    @Transactional()
    async getReport(id: number): Promise<[Task, TaskReportDto]> {
        const task = await this.taskRepository
            .createQueryBuilder("task")
            .leftJoinAndSelect("task.assignments", "assignment", "assignment.id_task = :id", { id })
            .leftJoinAndSelect("task.stages", "stage", "stage.id_task = :id", { id })
            .where("task.id = :id", { id })
            .orderBy("assignment.created_at", "ASC")
            .addOrderBy("stage.created_at", "ASC")
            .getOne();
        const templates = await this.templateService.findByTaskId(task.id);
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

    async addTaskDocument(document: TaskDocument): Promise<TaskDocument> {
        return this.taskDocumentRepository.save(document);
    }

    async documentByIdExists(id: number): Promise<boolean> {
        return !!(await this.taskDocumentRepository.findOne(id));
    }

    @Transactional()
    async deleteDocumentById(taskId: number, documentId: number): Promise<void> {
        const document = await this.taskDocumentRepository.findOne(documentId);
        await this.taskDocumentRepository.delete({ id_task: taskId, id: documentId });
        const pathToFile = process.cwd() + `/public/${document.filename}`;
        if (!existsSync(pathToFile)) {
            throw new AssetNotFoundException(`File "${document.filename}" Not Found`);
        }
        unlinkSync(pathToFile);
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

    private getFileName(
        files?: Express.Multer.File[],
        templatePuzzleId?: string,
    ): string | undefined {
        if (!files || !templatePuzzleId) {
            return;
        }
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

    private getTemplatePuzzleIdsWithoutComments(keys: string[], templateId: number): string[] {
        return keys.filter(id => id.startsWith(templateId.toString()) && !id.includes("comment"));
    }

    private async ensurePuzzlesSettled(taskId: number, puzzleIds: string[]): Promise<void> {
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

    private groupKeysBy(keys: string[], predicate: (key: string) => string): string[] {
        return keys.reduce((prev, curr) => {
            const existing = prev.find(key => key === predicate(curr));
            if (existing) {
                return prev;
            }
            return [...prev, predicate(curr)];
        }, []);
    }

    async setAllAssignmentsNonEditable(id: number): Promise<void> {
        const assignments = await this.templateAssignmentRepository.find({
            where: { id_task: id },
        });
        assignments.forEach(assignment => (assignment.editable = false));
        await this.templateAssignmentRepository.save(assignments);
    }

    async findActiveStage(id: number): Promise<TaskStage | undefined> {
        return this.taskStageRepository.findOne({
            where: { id_task: id, finished: false },
            order: { created_at: "ASC" },
        });
    }
}
