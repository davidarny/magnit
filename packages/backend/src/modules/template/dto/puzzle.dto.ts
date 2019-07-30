import { ConditionDto } from "./condition.dto";
import { ValidationDto } from "./validation.dto";
import { TAnswerType, TPuzzleType } from "../entities/puzzle.entity";

export class PuzzleDto {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly order: number;
    readonly puzzle_type: TPuzzleType;
    readonly answer_type: TAnswerType;
    readonly conditions: ConditionDto[];
    readonly validations: ValidationDto[];
    readonly puzzles: PuzzleDto[];
}
