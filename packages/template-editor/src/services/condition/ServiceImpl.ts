import { IService, IServiceOptions } from "./IService";
import { EConditionType } from "entities";

export class ServiceImpl implements IService {
    constructor(protected readonly options: IServiceOptions) {}

    getConditionLiteral(): string {
        if (this.options.index === 0) {
            return "Если";
        }
        return {
            [EConditionType.AND]: "И",
            [EConditionType.OR]: "Или",
        }[this.options.conditionType];
    }
}
