import { TActionType, TConditionType } from "../entities/condition.entity";

export class ConditionDto {
    readonly id: string;
    readonly order: number;
    readonly value: string;
    readonly question_puzzle: string;
    readonly answer_puzzle: string;
    readonly action_type: TActionType;
    readonly condition_type: TConditionType;
}
