import { TPuzzleType } from "./puzzle.entity";
import { ConditionDto } from "./condition.dto";
import { ValidationDto } from "./validation.dto";

export class PuzzleDto {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly order: number;
    readonly puzzle_type: TPuzzleType;
    readonly conditions: ConditionDto[];
    readonly validations: ValidationDto[];
    readonly puzzles: PuzzleDto[];
}
