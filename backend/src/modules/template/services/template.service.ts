import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as _ from "lodash";
import { DeepPartial, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { CannotInsertTemplateException } from "../../../shared/exceptions/cannot-insert-template.exception";
import { PuzzleNotFoundException } from "../../../shared/exceptions/puzzle-not-found.exception";
import { TemplateAnswerLocation } from "../entities/template-answer-location.entity";
import { TemplateAnswer } from "../entities/template-answer.entity";
import { IPuzzle, Template } from "../entities/template.entity";
import { FindAllQuery } from "../queries/find-all.query";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template)
        private readonly templateRepository: Repository<Template>,
        @InjectRepository(TemplateAnswer)
        private readonly templateAnswerRepository: Repository<TemplateAnswer>,
        @InjectRepository(TemplateAnswerLocation)
        private readonly templateAnswerLocationRepository: Repository<TemplateAnswerLocation>,
    ) {}

    @Transactional()
    async findByPuzzleId(taskId: number, puzzleId: string): Promise<TemplateAnswer> {
        return this.templateAnswerRepository.findOne({
            where: { id_task: taskId, id_puzzle: puzzleId },
        });
    }

    @Transactional()
    async findAll(query: DeepPartial<FindAllQuery> = {}, extended: boolean = false) {
        let sql = `
            SELECT
                t.id,
                t.title,
                t.description,
                t.type,
                t.version,
                t.created_at,
                t.updated_at
                ${extended ? ", t.sections" : ""}
            FROM template t
            WHERE 1 = 1
        `;
        const params: Array<string | number> = [];
        if (!_.isNil(query.title)) {
            params.push(`%${query.title.toLowerCase()}%`);
            sql += ` AND lower(t.title) LIKE $${params.length} `;
        }
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
        const templates = await this.templateRepository.query(sql, params);
        const all = await this.templateRepository.count();
        return [templates, all];
    }

    @Transactional()
    async findOneOrFail(templateId: number) {
        return this.templateRepository.findOneOrFail({ where: { id: templateId } });
    }

    @Transactional()
    async findAssignmentExtended(taskId: number) {
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
                to_jsonb(array_remove(array_agg(DISTINCT ta), NULL)) as answers,
                to_jsonb(array_remove(array_agg(DISTINCT c), NULL)) as comments
            FROM template_assignment tas
            LEFT JOIN template t ON t.id = tas.id_template
            LEFT JOIN template_answer ta ON ta.id_template = t.id AND ta.id_task = tas.id_task
            LEFT JOIN comment c ON c.id_assignment = tas.id
            WHERE tas.id_task = $1
            GROUP BY t.id, tas.id
            ORDER BY t.id, tas.id
        `,
            [taskId],
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
    async update(templateId: number, template: Template) {
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
        builder.set(values).where("id = :id", { id: templateId });
        await builder.execute();
        return await this.templateRepository.findOne({ id: templateId });
    }

    @Transactional()
    async findById(templateId: number) {
        return this.templateRepository.findOne({ where: { id: templateId } });
    }

    @Transactional()
    async delete(templateId: number) {
        await this.templateRepository.delete(templateId);
    }

    @Transactional()
    async saveAnswerBulk(answers: TemplateAnswer[]) {
        return this.templateAnswerRepository.save(answers);
    }

    @Transactional()
    async saveLocation(templateAnswerLocation: TemplateAnswerLocation) {
        return this.templateAnswerLocationRepository.save(templateAnswerLocation);
    }

    async findPuzzles(template: Template, puzzleIds: string[]): Promise<Map<string, IPuzzle>> {
        const result = new Map<string, IPuzzle>();
        const rest = [...puzzleIds];
        // find all puzzles from set of ids
        await this.traverse(template.sections as object[], value => {
            if (isPuzzle(value) && rest.includes(value.id)) {
                const indexToRemove = rest.findIndex(restId => restId === value.id);
                if (indexToRemove !== -1) {
                    rest.splice(indexToRemove, 1);
                }
                result.set(value.id, value);
                return !puzzleIds.length;
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

function isPuzzle(value: object): value is IPuzzle {
    return _.has(value, "id") && _.has(value, "puzzles");
}
