import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import { FindManyOptions, Repository, Transaction, TransactionRepository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { TemplateAnswer } from "../entities/template-answer.entity";
import { IPuzzle, Template } from "../entities/template.entity";
import { ITemplateService } from "../interfaces/template.service.interface";
import _ = require("lodash");

@Injectable()
export class TemplateService implements ITemplateService {
    @Transaction({ isolation: "READ COMMITTED" })
    async findAnswersById(
        id: string,
        @TransactionRepository(TemplateAnswer)
        templateAnswerRepository?: Repository<TemplateAnswer>,
    ): Promise<TemplateAnswer[]> {
        return templateAnswerRepository.find({ where: { id_template: id } });
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async findByPuzzleId(
        id: string,
        @TransactionRepository(TemplateAnswer)
        templateAnswerRepository?: Repository<TemplateAnswer>,
    ): Promise<TemplateAnswer> {
        return templateAnswerRepository.findOne({ where: { id_puzzle: id } });
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        title?: string,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
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
        return templateRepository.find(options);
    }

    // TODO: remove this one and handle 404 more accurately
    @Transaction({ isolation: "READ COMMITTED" })
    /** @deprecated */
    async findOneOrFail(
        id: string,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        return templateRepository.findOneOrFail({ where: { id } });
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async findByTaskId(
        id: string,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        return templateRepository.query(
            `
            SELECT
                "template"."id",
                "template"."title",
                "template"."description",
                "template"."sections",
                "template"."type",
                "template"."created_at",
                "template"."updated_at",
                "template_assignment"."editable",
                to_jsonb(array_agg("template_answer")) as "answers"
            FROM "template_assignment"
            LEFT JOIN "template" ON "template"."id" = "template_assignment"."id_template"
            LEFT JOIN "template_answer" on "template"."id" = "template_answer"."id_template"
            WHERE "template_assignment"."id_task" = $1
            GROUP BY "template"."id", "template_assignment"."id"
        `,
            [id],
        );
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async insert(
        template: Template,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        // tricky insert
        // need this only for jsonb_strip_nulls()
        const response = await templateRepository.query(
            `
            INSERT INTO
            "template" ("title", "description", "sections", "type", "created_at", "updated_at")
            VALUES
            ($1, $2, jsonb_strip_nulls($3), $4, DEFAULT, DEFAULT)
            RETURNING "id", "type", "created_at", "updated_at"
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
                return templateRepository.findOne({ id: inserted.id });
            } else {
                throw new InternalServerErrorException("Cannot save/update template");
            }
        } else {
            throw new InternalServerErrorException("Cannot save/update template");
        }
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async update(
        id: string,
        template: Template,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        // tricky update
        // need this only for jsonb_strip_nulls()
        const builder = await templateRepository.createQueryBuilder("template").update();
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
        const result = await templateRepository.findOne({ id: Number(id) });
        if (!result) {
            throw new BadRequestException("Cannot update Template");
        }
        return result;
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async findById(
        id: string,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        return templateRepository.findOne({ where: { id } });
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async deleteById(
        id: string,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        await templateRepository.delete(id);
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async insertAnswerBulk(
        assets: TemplateAnswer[],
        @TransactionRepository(TemplateAnswer) templateAssetRepository?: Repository<TemplateAnswer>,
    ) {
        return templateAssetRepository.save(assets);
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async findPuzzlesByIds(
        id: string,
        ids: string[],
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ): Promise<Map<string, IPuzzle>> {
        const result = new Map<string, IPuzzle>();
        const template = await templateRepository.findOne(id);
        const rest = [...ids];
        const isValuePuzzle = (value: object): value is IPuzzle =>
            _.has(value, "id") && _.has(value, "puzzles");
        // find all puzzles from set of ids
        await this.traverse(template.sections as object[], value => {
            if (isValuePuzzle(value) && rest.includes(value.id)) {
                const indexToRemove = rest.findIndex(id => id === value.id);
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
            throw new NotFoundException(`Puzzle(s) ${rest.join(", ")} not found`);
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
