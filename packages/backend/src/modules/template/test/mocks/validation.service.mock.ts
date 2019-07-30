import { puzzleService } from "./puzzle.service.mock";

const payload = require("../payload.json");

export const validationService = {
    async findByPuzzleId(id: string) {
        const puzzles = [
            ...(await puzzleService.findBySectionId(payload.sections[0].id)),
            ...(await puzzleService.findByParentId(id)),
        ];
        return puzzles.reduce((prev, curr) => {
            if (curr.id !== id) {
                return prev;
            }
            return [...prev, ...(curr.validations || [])];
        }, []);
    },
};
