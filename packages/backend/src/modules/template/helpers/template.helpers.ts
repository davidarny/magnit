import { Puzzle } from "./puzzle.entity";
import { ConditionDto, PuzzleDto, ValidationDto } from "./template.dto";
import { Section } from "./section.entity";
import { Template } from "./template.entity";
import { Condition } from "./condition.entity";
import { Validation } from "./validation.entity";

export function deeplyCreatePuzzles(
    puzzles: Puzzle[],
    puzzleDtoArray: PuzzleDto[],
    section: Section,
    template: Template
) {
    for (const puzzleDto of puzzleDtoArray || []) {
        const puzzle = new Puzzle();
        puzzle.conditions = [];
        puzzle.validations = [];
        puzzle.section = section;
        puzzle.template = template;
        setPuzzleFields(puzzle, puzzleDto);

        for (const conditionDto of puzzleDto.conditions || []) {
            if (!conditionDto.question_puzzle) {
                continue;
            }
            const condition = new Condition();
            puzzle.conditions.push(condition);
            condition.puzzle = puzzle;
            setConditionFields(condition, conditionDto, puzzles);
        }

        for (const validationDto of puzzleDto.validations || []) {
            if (!validationDto.left_hand_puzzle) {
                continue;
            }
            const validation = new Validation();
            puzzle.validations.push(validation);
            validation.puzzle = puzzle;
            setValidationFields(validation, validationDto, puzzle, puzzles);
        }

        deeplyCreatePuzzles(puzzles, puzzleDto.puzzles, section, template);

        puzzles.push(puzzle);
    }
}

function setPuzzleFields(puzzle: Puzzle, puzzleDto: PuzzleDto) {
    puzzle.id = puzzleDto.id;
    puzzle.puzzleType = puzzleDto.puzzle_type;
    puzzle.description = puzzleDto.description;
    puzzle.order = puzzleDto.order;
    puzzle.title = puzzleDto.title;
}

function setConditionFields(condition: Condition, conditionDto: ConditionDto, puzzles: Puzzle[]) {
    condition.id = conditionDto.id;
    condition.actionType = conditionDto.action_type;
    condition.value = conditionDto.value;
    condition.conditionType = conditionDto.condition_type;
    condition.questionPuzzle = puzzles.find(puzzle => puzzle.id === conditionDto.question_puzzle);
    condition.answerPuzzle = puzzles.find(puzzle => puzzle.id === conditionDto.answer_puzzle);
}

function setValidationFields(
    validation: Validation,
    validationDto: ValidationDto,
    puzzle: Puzzle,
    puzzles: Puzzle[]
) {
    validation.id = validationDto.id;
    validation.errorMessage = validationDto.error_message;
    validation.operatorType = validationDto.operator_type;
    validation.validationType = validationDto.validation_type;
    validation.value = validationDto.value;
    validation.leftHandPuzzle = puzzle;
    validation.rightHandPuzzle = puzzles.find(
        puzzle => puzzle.id === validationDto.right_hand_puzzle
    );
}
