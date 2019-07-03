import { EConditionType } from "entities";

export interface IService {
    getConditionLiteral(): string;
}

export interface IServiceOptions {
    index: number;
    conditionType: EConditionType;
}
