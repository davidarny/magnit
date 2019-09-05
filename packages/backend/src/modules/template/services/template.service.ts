import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CannotInsertTemplateException } from "../../../shared/exceptions/cannot-insert-template.exception";
import { PuzzleNotFoundException } from "../../../shared/exceptions/puzzle-not-found.exception";
import { TemplateAnswer } from "../entities/template-answer.entity";
import { IPuzzle, Template } from "../entities/template.entity";
import { ITemplateService } from "../interfaces/template.service.interface";
import _ = require("lodash");

@Injectable()
export class TemplateService implements ITemplateService {
    constructor(
        @InjectRepository(Template)
        private readonly templateRepository: Repository<Template>,
        @InjectRepository(TemplateAnswer)
        private readonly templateAnswerRepository: Repository<TemplateAnswer>,
    ) {}

    async findAnswersById(id: string): Promise<TemplateAnswer[]> {
        return this.templateAnswerRepository.find({ where: { id_template: id } });
    }

    async findByPuzzleId(taskId: string, puzzleId: string): Promise<TemplateAnswer> {
        return this.templateAnswerRepository.findOne({
            where: { id_task: taskId, id_puzzle: puzzleId },
        });
    }

    async findAll(offset?: number, limit?: number, sort?: "ASC" | "DESC", title?: string) {
        // TODO: probably need to introduce FindOptionsBuilder
        const options: FindManyOptions<Template> = {};
        if (typeof offset !== "undefined") {
            options.skip = offset;
        }
        if (typeof limit !== "undefined") {
            options.take = limit;
        }
        if (sort) {
            options.order = { title: sort };
        }
        if (title) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { title });
        }
        return this.templateRepository.find(options);
    }

    // TODO: remove this one and handle 404 more accurately
    /** @deprecated */
    async findOneOrFail(id: string) {
        return this.templateRepository.findOneOrFail({ where: { id } });
    }

    async findByTaskId(id: string) {
        return this.templateRepository.query(
            `
            SELECT
                t.id,
                t.title,
                t.description,
                t.sections,
                t.type,
                t.created_at,
                t.updated_at,
                t.version,
                tas.editable,
                to_jsonb(array_remove(array_agg(ta), NULL)) as answers
            FROM template_assignment tas
            LEFT JOIN template t ON tas.id_template = t.id
            LEFT JOIN template_answer ta ON ta.id_template = t.id AND ta.id_task = tas.id_task
            WHERE tas.id_task = $1
            GROUP BY t.id, tas.id
            ORDER BY t.id, tas.id
        `,
            [id],
        );
    }

    @Transactional()
    async insert(template: Template) {
        // tricky insert
        // need this only for jsonb_strip_nulls()
        const response = await this.templateRepository.query(
            `
            INSERT INTO
            template (title, description, sections, type, created_at, updated_at)
            VALUES
            ($1, $2, jsonb_strip_nulls($3), $4, DEFAULT, DEFAULT)
            RETURNING id, type, created_at, updated_at
        `,
            [
                template.title,
                template.description,
                JSON.stringify(template.sections),
                template.type,
            ],
        );
        if (Array.isArray(response) && response.length > 0) {
            const inserted = response.pop();
            if (inserted && inserted.id) {
                return this.templateRepository.findOne({ id: inserted.id });
            } else {
                throw new CannotInsertTemplateException("Cannot insert template");
            }
        } else {
            throw new CannotInsertTemplateException("Cannot insert template");
        }
    }

    @Transactional()
    async update(id: string, template: Template) {
        // tricky update
        // need this only for jsonb_strip_nulls()
        const builder = await this.templateRepository.createQueryBuilder("template").update();
        const values: QueryDeepPartialEntity<Template> = {};
        if (template.title || typeof template.title === "string") {
            values.title = template.title;
        }
        if (template.description || typeof template.description === "string") {
            values.description = template.description;
        }
        if (template.type) {
            values.type = template.type;
        }
        if (template.sections) {
            values.sections = () =>
                `to_jsonb(json_strip_nulls('${JSON.stringify(template.sections)}'))`;
        }
        builder.set(values).where("id = :id", { id: Number(id) });
        await builder.execute();
        return await this.templateRepository.findOne({ id: Number(id) });
    }

    async findById(id: string) {
        return this.templateRepository.findOne({ where: { id } });
    }

    async deleteById(id: string) {
        await this.templateRepository.delete(id);
    }

    async insertAnswerBulk(answers: TemplateAnswer[]) {
        return this.templateAnswerRepository.save(answers);
    }

    @Transactional()
    async findPuzzlesByIds(id: string, ids: string[]): Promise<Map<string, IPuzzle>> {
        const result = new Map<string, IPuzzle>();
        const template = await this.templateRepository.findOne(id);
        const rest = [...ids];
        const isValuePuzzle = (value: object): value is IPuzzle =>
            _.has(value, "id") && _.has(value, "puzzles");
        // find all puzzles from set of ids
        await this.traverse(template.sections as object[], value => {
            if (isValuePuzzle(value) && rest.includes(value.id)) {
                const indexToRemove = rest.findIndex(restId => restId === value.id);
                if (indexToRemove !== -1) {
                    rest.splice(indexToRemove, 1);
                }
                result.set(value.id, value);
                return !ids.length;
            }
        });
        // if we are not out of ids
        // then some of puzzles are not found
        if (rest.length) {
            throw new PuzzleNotFoundException(`Puzzle(s) ${rest.join(", ")} not found`);
        }
        return result;
    }

    private async traverse(array: object[], predicate: (value: object) => boolean) {
        return new Promise(resolve => {
            const query = [...array];
            while (query.length) {
                const first = _.first(query);
                query.shift();
                if (predicate(first)) {
                    return resolve();
                }
                for (const key of Object.keys(first)) {
                    if (first[key] instanceof Array) {
                        query.push(...first[key]);
                    }
                }
            }
            resolve();
        });
    }
}
