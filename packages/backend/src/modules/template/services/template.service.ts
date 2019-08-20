import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { FindManyOptions, Repository, Transaction, TransactionRepository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Template } from "../entities/template.entity";
import { ITemplateService } from "../interfaces/template.service.interface";

@Injectable()
export class TemplateService implements ITemplateService {
    @Transaction({ isolation: "READ COMMITTED" })
    async findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        title?: string,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
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

    @Transaction({ isolation: "READ COMMITTED" })
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
                "task_to_template"."editable"
            FROM "template"
            LEFT JOIN "task_to_template" ON "task_to_template"."id_task" = $1
        `,
            [id],
        );
    }

    @Transaction({ isolation: "READ COMMITTED" })
    async insert(
        template: Template,
        @TransactionRepository(Template) templateRepository?: Repository<Template>,
    ) {
        const response = await templateRepository.query(
            `
            INSERT INTO
            "template" ("title", "description", "sections", "type", "created_at", "updated_at")
            VALUES
            ($1, $2, json_strip_nulls(json_array_elements($3)), $4, DEFAULT, DEFAULT)
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
}
