import { Template } from "../entities/template.entity";
import { Section } from "../entities/section.entity";
import { PuzzleDto } from "../dto/puzzle.dto";
import { Puzzle } from "../entities/puzzle.entity";
import { Condition } from "../entities/condition.entity";
import { Validation } from "../entities/validation.entity";

export function deeplyCreatePuzzles(
    puzzles: Puzzle[],
    puzzleDtoArray: PuzzleDto[],
    section: Section,
    template: Template,
    parent: Puzzle | null = null
) {
    for (const puzzleDto of puzzleDtoArray || []) {
        const puzzle = new Puzzle(puzzleDto);
        puzzle.conditions = [];
        puzzle.validations = [];

        for (const conditionDto of puzzleDto.conditions || []) {
            if (!conditionDto.question_puzzle) {
                continue;
            }
            const condition = new Condition(conditionDto);
            puzzle.conditions.push(condition);
            condition.puzzle = puzzle;
        }

        for (const validationDto of puzzleDto.validations || []) {
            if (!validationDto.left_hand_puzzle) {
                continue;
            }
            const validation = new Validation(validationDto);
            puzzle.validations.push(validation);
            validation.puzzle = puzzle;
        }

        if (parent) {
            puzzle.parent = parent;
        }

        deeplyCreatePuzzles(puzzles, puzzleDto.puzzles, section, template, puzzle);

        puzzles.push(puzzle);
    }
}
