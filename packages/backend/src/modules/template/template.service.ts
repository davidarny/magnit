import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "./template.entity";
import { Repository } from "typeorm";

@Injectable()
export class TemplateService {
    constructor(
        @InjectRepository(Template) private readonly templateRepository: Repository<Template>
    ) {}

    findAll(): Promise<Template[]> {
        return this.templateRepository.find();
    }

    async save(template: Template): Promise<Template> {
        return this.templateRepository.save(template);
    }
}
