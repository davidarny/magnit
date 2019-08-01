import { Template } from "../entities/template.entity";
import { Puzzle } from "../entities/puzzle.entity";
import { ISectionService } from "../interfaces/section.service.interface";
import { IPuzzleService } from "../interfaces/puzzle.service.interface";
import { IConditionService } from "../interfaces/condition.service.interface";
import { IValidationService } from "../interfaces/validation.service.interface";

type TServices = {
    sectionService: ISectionService;
    puzzleService: IPuzzleService;
    conditionService: IConditionService;
    validationService: IValidationService;
};

export async function assembleTemplate(template: Template, services: TServices) {
    template.sections = await services.sectionService.findByTemplateId(template.id);
    for (const section of template.sections || []) {
        section.puzzles = await services.puzzleService.findBySectionId(section.id);
    }
    const puzzles: Puzzle[] = [
        ...template.sections.reduce((prev, curr) => [...prev, ...curr.puzzles], []),
    ];
    for (const puzzle of puzzles) {
        if (puzzle.puzzle_type === "group") {
            puzzle.children = await services.puzzleService.findByParentId(puzzle.id);
            puzzles.push(...puzzle.children);
        }
    }
    for (const puzzle of puzzles) {
        const conditions = await services.conditionService.findByPuzzleId(puzzle.id);
        puzzle.conditions = conditions || [];
        const validations = await services.validationService.findByPuzzleId(puzzle.id);
        puzzle.validations = validations || [];
    }
}
