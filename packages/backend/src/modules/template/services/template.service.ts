import { Injectable, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Template } from "../entities/template.entity";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template) private readonly templateRepository: Repository<Template>
    ) {}

    async findAll(offset: number, limit: number, sort: "ASC" | "DESC", title: string) {
        return this.templateRepository.find({
            order: { title: sort },
            where: { title },
            skip: offset,
            take: limit,
        });
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
