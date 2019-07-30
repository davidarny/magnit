import { TOperatorType, TValidationType } from "./validation.entity";
import { TActionType, TConditionType } from "./condition.entity";
import { TPuzzleType } from "./puzzle.entity";
import { TTemplateType } from "./template.entity";

export class ValidationDto {
    readonly id: string;
    readonly order: number;
    readonly validation_type: TValidationType;
    readonly operator_type: TOperatorType;
    readonly error_message: string;
    readonly left_hand_puzzle: string;
    readonly value?: string;
    readonly right_hand_puzzle?: string;
}

export class ConditionDto {
    readonly id: string;
    readonly order: number;
    readonly value: string;
    readonly question_puzzle: string;
    readonly answer_puzzle: string;
    readonly action_type: TActionType;
    readonly condition_type: TConditionType;
}

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

export class SectionDto {
    readonly id: string;
    readonly order: number;
    readonly title: string;
    readonly description: string;
    readonly puzzles: PuzzleDto[];
}

export class TemplateDto {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly type: TTemplateType;
    readonly sections: SectionDto[];
}
