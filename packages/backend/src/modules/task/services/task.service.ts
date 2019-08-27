import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, In, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { TemplateAnswer } from "../../template/entities/template-answer.entity";
import { IPuzzle } from "../../template/entities/template.entity";
import { ITemplateService } from "../../template/interfaces/template.service.interface";
import { TemplateService } from "../../template/services/template.service";
import { ETaskStatus, Task } from "../entities/task.entity";
import { ITaskService } from "../interfaces/task.service.interface";
import _ = require("lodash");

@Injectable()
export class TaskService implements ITaskService {
    // TODO: need to use @TransactionalRepository on a method
    constructor(
        @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
        @Inject(TemplateService) private readonly templateService: ITemplateService,
    ) {}

    @Transactional()
    async findAll(
        offset?: number,
        limit?: number,
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
            options.order = { title: sort };
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
            Object.assign(options.where, { title });
        }
        return this.taskRepository.find(options);
    }

    @Transactional()
    async insert(task: Task) {
        // in case if insert() is called with existing task
        // semantics of this methods is about creating new onde
        delete task.id;
        return this.taskRepository.save(task);
    }

    @Transactional()
    async findById(id: string, relations: string[] = []) {
        return this.taskRepository.findOne({ where: { id }, relations });
    }

    @Transactional()
    async deleteById(id: string) {
        await this.taskRepository.delete(id);
    }

    @Transactional()
    async update(id: string, task: Task): Promise<Task> {
        return this.taskRepository.save({ ...task, id: Number(id) });
    }

    @Transactional()
    async setTaskAnswers(
        ids: string[],
        files: Express.Multer.File[],
        body: { [key: string]: string },
    ) {
        // get all template ids in keys
        const templateIds = this.groupKeysBy(ids, id => this.getTemplateIdFromMultipartKey(id));
        await Promise.all(
            templateIds.map(async templateId => {
                // group all key with array index suffix
                const puzzleIds = this.groupKeysBy(ids, id => this.getPuzzleIdFromMultipartKey(id));
                this.ensurePuzzlesSettled(puzzleIds);
                // remove id of comment suffix
                // cause we don't store that separately
                const templatePuzzleIds = this.getTemplatePuzzleIdsWithoutComments(ids, templateId);
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

    private async ensurePuzzlesSettled(ids: string[]): Promise<void> {
        // validating here cause pipe cannot get access
        // to file array and it's keys
        const promises = ids.map(async id => ({
            id,
            result: await this.templateService.findByPuzzleId(id),
        }));
        let results: { id: string; result?: TemplateAnswer }[];
        try {
            results = await Promise.all(promises);
        } catch (error) {
            throw new NotFoundException(`Cannot save answers`);
        }
        for (const result of results) {
            if (result.result) {
                throw new BadRequestException(
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
            },
        }[prevStatus][nextStatus];
    }
}
