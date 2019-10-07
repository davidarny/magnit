import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { existsSync, unlinkSync } from "fs";
import * as _ from "lodash";
import { DeepPartial, In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import * as XLSX from "xlsx";
import { AssetNotFoundException } from "../../../shared/exceptions/asset-not-found.exception";
import { CannotParseLocationException } from "../../../shared/exceptions/cannot-prase-location.location";
import { CannotSaveAnswersException } from "../../../shared/exceptions/cannot-save-answers.exception";
import { CannotSaveDuplicateAnswerException } from "../../../shared/exceptions/cannot-save-duplicate-answer.exception";
import { InvalidTaskStatusException } from "../../../shared/exceptions/invalid-task-status.exception";
import { LocationNotFoundInBodyException } from "../../../shared/exceptions/location-not-found-in-body.exception";
import { TemplateNotFoundException } from "../../../shared/exceptions/template-not-found.exception";
import { MarketplaceService } from "../../marketplace/services/marketplace.service";
import { TemplateAnswerLocationDto } from "../../template/dto/template-answer-location.dto";
import { TemplateAnswerLocation } from "../../template/entities/template-answer-location.entity";
import { TemplateAnswer } from "../../template/entities/template-answer.entity";
import { IPuzzle } from "../../template/entities/template.entity";
import { TemplateService } from "../../template/services/template.service";
import { ReportStageDto, ReportTemplateDto, TaskReportDto } from "../dto/task-report.dto";
import { TaskStageDto } from "../dto/task-stage.dto";
import { TemplateAssignmentDto } from "../dto/template-assignment.dto";
import { Comment } from "../entities/comment.entity";
import { TaskDocument } from "../entities/task-document.entity";
import { TaskStage } from "../entities/task-stage.entity";
import { ETaskStatus, Task } from "../entities/task.entity";
import { TemplateAssignment } from "../entities/tempalte-assignment.entity";
import { FindAllQueryExtended } from "../queries/find-all-extended.query";
import { FindAllQuery } from "../queries/find-all.query";

export type TTaskWithLastStageAndToken = Task & { tokens: string[]; stage: TaskStage };

@Injectable()
export class TaskService {
    constructor(
        private readonly templateService: TemplateService,
        private readonly marketplaceService: MarketplaceService,
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(TaskStage) private readonly taskStageRepository: Repository<TaskStage>,
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @InjectRepository(TemplateAssignment)
        private readonly templateAssignmentRepository: Repository<TemplateAssignment>,
        @InjectRepository(TaskDocument)
        private readonly taskDocumentRepository: Repository<TaskDocument>,
    ) {}

    async findTasksWithExpiringStages(): Promise<TTaskWithLastStageAndToken[]> {
        return await this.taskRepository.query(`
            SELECT
                t.*,
                json_agg(ts.*) -> json_array_length(json_agg(ts.*)) - 1  AS stage,
                to_json(array_remove(array_agg(pt.token), NULL)) AS tokens
            FROM task_stage ts
            LEFT JOIN task t ON ts.id_task = t.id
            LEFT JOIN push_token pt ON t.id_assignee = pt.id_user
            WHERE EXTRACT(day FROM ts.deadline - date(now())) <= t.notify_before
            AND NOT(ts.finished)
            GROUP BY t.id, t.created_at, ts.created_at
            ORDER BY t.created_at, ts.created_at
        `);
    }

    async findAll(query: DeepPartial<FindAllQuery> = {}) {
        let sql = `
            SELECT t.*,
                   to_json(m) AS marketplace,
                   to_json(array_remove(array_agg(DISTINCT ts), NULL)) AS stages
            FROM task t
                     LEFT JOIN marketplace m ON m.id = t.id_marketplace
                     LEFT JOIN task_stage ts ON t.id = ts.id_task
            WHERE 1 = 1
        `;
        const params: Array<string | number> = [];
        if (!_.isNil(query.status)) {
            params.push(query.status);
            sql += ` AND t.status = $${params.length} `;
        }
        if (!_.isNil(query.statuses)) {
            params.push(`(${query.statuses.join(",")})`);
            sql += ` AND t.status IN $${params.length} `;
        }
        if (!_.isNil(query.title)) {
            params.push(`%${query.title.toLowerCase()}%`);
            sql += ` AND lower(t.title) LIKE $${params.length} `;
        }
        sql += "GROUP BY t.id, m.*";
        if (!_.isNil(query.sort)) {
            sql += ` ORDER BY t.${query.sortBy || "title"} ${query.sort} `;
        }
        if (!_.isNil(query.limit)) {
            params.push(query.limit);
            sql += ` LIMIT $${params.length} `;
        }
        if (!_.isNil(query.offset)) {
            params.push(query.offset);
            sql += ` OFFSET $${params.length} `;
        }
        const tasks = await this.taskRepository.query(sql, params);
        const all = await this.taskRepository.count();
        return [tasks, all];
    }

    async findAllExtended(query: DeepWriteable<DeepPartial<FindAllQueryExtended>> = {}) {
        let sql = `
            SELECT t.*,
                   m.address,
                   m.format,
                   m.city,
                   m.region,
                   ts.title AS stage_title,
                   ts.deadline
            FROM task t
                     LEFT JOIN marketplace m ON m.id = t.id_marketplace
                     LEFT JOIN
                     (
                        SELECT *
                        FROM task_stage
                        WHERE finished = false
                        ORDER BY created_at DESC
                        LIMIT 1
                     ) ts ON t.id = ts.id_task
            WHERE 1 = 1
        `;
        const params: Array<string | number> = [];
        if (!_.isNil(query.status)) {
            params.push(query.status);
            sql += ` AND t.status = $${params.length} `;
        }
        if (!_.isNil(query.statuses)) {
            params.push(`(${query.statuses.join(",")})`);
            sql += ` AND t.status IN $${params.length} `;
        }
        if (!_.isNil(query.title)) {
            params.push(`%${query.title.toLowerCase()}%`);
            sql += ` AND lower(t.title) LIKE $${params.length} `;
        }
        if (!_.isNil(query.region)) {
            params.push(`%${query.region.toLowerCase()}%`);
            sql += ` AND lower(m.region) LIKE $${params.length} `;
        }
        if (!_.isNil(query.city)) {
            params.push(`%${query.city.toLowerCase()}%`);
            sql += ` AND lower(m.city) LIKE $${params.length} `;
        }
        sql += "GROUP BY t.id, m.address, m.format, m.city, m.region, ts.title, ts.deadline";
        if (!_.isNil(query.sort)) {
            const stage = ["stage_title", "deadline"];
            const marketplace = ["address", "city", "format", "region"];
            let prefix = "t";
            if (stage.includes(query.sortBy)) {
                // cannot use alias
                // so it'll be ts.title
                if (query.sortBy === "stage_title") {
                    query.sortBy = "title";
                }
                prefix = "ts";
            } else if (marketplace.includes(query.sortBy)) {
                prefix = "m";
            }
            sql += ` ORDER BY ${prefix}.${query.sortBy || "title"} ${query.sort} `;
        }
        if (!_.isNil(query.limit)) {
            params.push(query.limit);
            sql += ` LIMIT $${params.length} `;
        }
        if (!_.isNil(query.offset)) {
            params.push(query.offset);
            sql += ` OFFSET $${params.length} `;
        }
        const tasks = await this.taskRepository.query(sql, params);
        const all = await this.taskRepository.count();
        return [tasks, all];
    }

    @Transactional()
    async insert(task: Task) {
        // in case if insert() is called with existing task
        // semantics of this methods is about creating new one
        await this.appendMarketplaceIfExists(task);
        const response = await this.taskRepository.insert(task);
        const ids = response.identifiers;
        return _.first(ids).id;
    }

    async findById(id: number) {
        const tasks = await this.taskRepository.query(
            `
                SELECT t.*,
                       to_json(m.*) AS marketplace,
                       to_json(array_remove(array_agg(DISTINCT ts), NULL)) AS stages
                FROM task t
                LEFT JOIN task_stage ts ON ts.id_task = t.id AND ts.id_task = $1
                LEFT JOIN marketplace m ON m.id = t.id_marketplace
                WHERE t.id = $1
                GROUP BY t.id, m.*;
        `,
            [id],
        );
        const task = _.first<Task>(tasks);
        if (!task) {
            throw new InternalServerErrorException(`Cannot fetch task "${id}"`);
        }
        return { ...task };
    }

    @Transactional()
    async findByIdExtended(id: number) {
        const tasks = await this.taskRepository.query(
            `
                SELECT t.*,
                       to_json(m.*) AS marketplace,
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
                LEFT JOIN marketplace m ON m.id = t.id_marketplace
                WHERE t.id = $1
                GROUP BY t.id, m.*;
        `,
            [id],
        );
        const task = _.first<Task>(tasks);
        if (!task) {
            throw new InternalServerErrorException(`Cannot fetch task "${id}"`);
        }
        const templates = await this.templateService.findTemplateAssignmentByIdExtended(task.id);
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

    @Transactional()
    async update(id: number, task: DeepPartial<Task>): Promise<void> {
        await this.appendMarketplaceIfExists(task);
        await this.taskRepository.save({ id, ...task });
    }

    @Transactional()
    async setTemplateAssignments(taskId: number, templateIds: number[]): Promise<void> {
        const prevAssignments = await this.templateAssignmentRepository.find({
            where: { id_task: taskId },
        });
        const prevComments = prevAssignments.length
            ? await this.commentRepository.find({
                  where: { id_assignment: In(prevAssignments.map(assignment => assignment.id)) },
                  relations: ["assignment"],
              })
            : [];
        const nextAssignments = templateIds.map(
            templateId => new TemplateAssignment({ id_task: taskId, id_template: templateId }),
        );
        await this.templateAssignmentRepository.save(nextAssignments);
        const nextComments = prevComments
            .filter(comment =>
                nextAssignments.some(
                    assignment =>
                        assignment.id_task === comment.assignment.id_task &&
                        assignment.id_template === comment.assignment.id_template,
                ),
            )
            .map(comment => {
                const commentAssignment = nextAssignments.find(
                    assignment =>
                        assignment.id_task === comment.assignment.id_task &&
                        assignment.id_template === comment.assignment.id_template,
                );
                return new Comment({
                    id_user: comment.id_user,
                    id_assignment: commentAssignment.id,
                    text: comment.text,
                });
            });
        await this.commentRepository.save(nextComments);
        await this.templateAssignmentRepository.remove(prevAssignments);
    }

    async updateTemplateAssignment(
        taskId: number,
        templateId: number,
        templateAssignmentDto: TemplateAssignmentDto,
    ): Promise<void> {
        await this.templateAssignmentRepository.update(
            { id_task: taskId, id_template: templateId },
            templateAssignmentDto,
        );
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
                    // collect answers
                    const answers = templatePuzzleIds
                        .map(templatePuzzleId => {
                            const puzzleId = this.getPuzzleIdFromMultipartKey(templatePuzzleId);
                            const puzzle = puzzles.get(puzzleId);
                            if (puzzle) {
                                // trying to get puzzle_type
                                const type = this.getPuzzleType(puzzle);
                                const file = this.getFileByTemplateId(files, templatePuzzleId);
                                if (file) {
                                    file.filename = `${process.env.BACKEND_HOST}/${file.filename}?originalname=${file.originalname}`;
                                }
                                const answer = file || body[templatePuzzleId];
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
        return _.get(
            {
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
            },
            `${prevStatus}.${nextStatus}`,
        );
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
        const templates = await this.templateService.findTemplateAssignmentByIdExtended(task.id);
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

    async addTaskStages(taskId: number, stageDtoArray: TaskStageDto[]) {
        const stages = stageDtoArray.map(
            taskStageDto =>
                new TaskStage({
                    ...taskStageDto,
                    id_task: taskId,
                }),
        );
        await this.taskStageRepository.save(stages);
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

    @Transactional()
    async addCommentToAssignment(
        taskId: number,
        templateId: number,
        userId: number,
        text: string,
    ): Promise<void> {
        const assignment = await this.templateAssignmentRepository.findOne({
            where: { id_task: taskId, id_template: templateId },
        });
        const comment = new Comment({
            assignment,
            id_user: userId,
            text,
        });
        await this.commentRepository.save(comment);
    }

    async removeAssignmentComment(commentId: number): Promise<void> {
        await this.commentRepository.delete(commentId);
    }

    async commentExists(commentId: number): Promise<boolean> {
        return !!(await this.commentRepository.findOne(commentId));
    }

    private async appendMarketplaceIfExists(task: DeepPartial<Task>) {
        if (task.marketplace) {
            const { city, region, address, format } = task.marketplace;
            const marketplace = await this.marketplaceService.findByPrimaries(
                region,
                city,
                format,
                address,
            );
            if (marketplace) {
                task.marketplace = marketplace;
            }
        }
    }

    private getFileByTemplateId(
        files?: Express.Multer.File[],
        templatePuzzleId?: string,
    ): Express.Multer.File | undefined {
        if (!files || !templatePuzzleId) {
            return;
        }
        return files.find(file => file.fieldname === templatePuzzleId);
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
}
