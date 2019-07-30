import { TOperatorType, TValidationType } from "../entities/validation.entity";

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
