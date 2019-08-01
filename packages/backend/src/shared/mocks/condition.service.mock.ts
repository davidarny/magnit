import { IConditionService } from "../interfaces/condition.service.interface";
import { IPuzzleService } from "../interfaces/puzzle.service.interface";

const payload = require("../../modules/template/test/template.json");

export class ConditionServiceMock implements IConditionService {
    constructor(private readonly puzzleService: IPuzzleService) {}

    async findByPuzzleId(id: string): Promise<any[]> {
        const puzzles = [
            ...(await this.puzzleService.findBySectionId(payload.sections[0].id)),
            ...(await this.puzzleService.findByParentId(id)),
        ];
        return puzzles.reduce((prev, curr) => {
            if (curr.id !== id) {
                return prev;
            }
            return [...prev, ...(curr.conditions || [])];
        }, []);
    }
}
