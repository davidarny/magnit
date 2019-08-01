import { Template } from "../entities/template.entity";
import { ITemplateService } from "../interfaces/template.service.interface";

const payload = require("../../modules/template/test/template.json");

export class TemplateServiceMock implements ITemplateService {
    async findOneOrFail(id: string) {
        return undefined;
    }

    async findAll() {
        return [];
    }

    async findByTaskId(id: string) {
        return [];
    }

    async save(template: Template) {
        return template;
    }

    async findById(id: string) {
        if (payload.id !== parseInt(id)) {
            return undefined;
        }
        const buffer = { ...payload };
        delete buffer.sections;
        return { ...buffer };
    }

    async deleteById(id: string) {
        return undefined;
    }
}
