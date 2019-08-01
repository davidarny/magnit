import { Template } from "../entities/template.entity";
import { ITemplateService } from "../interfaces/template.service.interface";

const payload = require("../../modules/template/test/template.json");

export class TemplateServiceMock implements ITemplateService {
    async findOneOrFail(id: string): Promise<any> {}

    async findAll(): Promise<any> {}

    async findByTaskId(id: string): Promise<any> {}

    async save(template: Template): Promise<any> {
        return template;
    }

    async findById(id: string): Promise<any> {
        if (payload.id !== parseInt(id)) {
            return;
        }
        const buffer = { ...payload };
        delete buffer.sections;
        return { ...buffer };
    }

    async deleteById(id: string) {}
}
