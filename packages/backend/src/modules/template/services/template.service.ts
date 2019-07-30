import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Template } from "../entities/template.entity";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template) private readonly templateRepository: Repository<Template>
    ) {}

    async findAll() {
        return this.templateRepository.find();
    }

    async save(template: Template) {
        return this.templateRepository.save(template);
    }

    async findById(id: string) {
        return this.templateRepository.findOne({ where: { id } });
    }
}
