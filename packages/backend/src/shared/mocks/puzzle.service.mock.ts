import { IPuzzleService } from "../interfaces/puzzle.service.interface";

const payload = require("../../modules/template/test/template.json");

export class PuzzleServiceMock implements IPuzzleService {
    async findBySectionId(id: string): Promise<any[]> {
        return payload.sections.reduce((prev, curr) => {
            if (curr.id !== id) {
                return prev;
            }
            return [...prev, ...curr.puzzles];
        }, []);
    }

    async findByParentId(id: string): Promise<any[]> {
        const puzzles = await this.findBySectionId(payload.sections[0].id);
        return puzzles.reduce((prev, curr) => {
            if (curr.id !== id) {
                return prev;
            }
            return [...prev, ...(curr.puzzles || [])];
        }, []);
    }
}
