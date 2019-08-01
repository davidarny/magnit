import { ISectionService } from "../interfaces/section.service.interface";

const payload = require("../../modules/template/test/template.json");

export class SectionServiceMock implements ISectionService {
    async findByTemplateId(id: number): Promise<any[]> {
        if (payload.id !== id) {
            return;
        }
        return payload.sections.map(section => {
            const buffer = { ...section };
            delete buffer.puzzles;
            return { ...buffer };
        });
    }
}
