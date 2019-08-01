import { Injectable, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, Repository } from "typeorm";
import { Template } from "../entities/template.entity";
import { Task } from "../../tasks/entities/task.entity";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template) private readonly templateRepository: Repository<Template>
    ) {}

    async findAll(offset?: number, limit?: number, sort?: "ASC" | "DESC", title?: string) {
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
            Object.assign(options.where, { title });
        }
        return this.templateRepository.find(options);
    }

    async save(template: Template) {
        return this.templateRepository.save(template);
    }

    async findById(id: string) {
        return this.templateRepository.findOne({ where: { id } });
    }

    async deleteById(id: string) {
        await this.templateRepository.delete(id);
    }
}
