import { IConditionsService, IConditionsServiceOptions } from "./IConditionsService";
import { ConditionService } from "./ConditionService";

export * from "./IConditionsService";
export * from "./ConditionService";

export function getConditionService(options: IConditionsServiceOptions): IConditionsService {
    return new ConditionService(options);
}
