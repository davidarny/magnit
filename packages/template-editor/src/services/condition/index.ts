import { IConditionsService, IConditionsServiceOptions } from "./IConditionsService";
import { ConditionService } from "./ConditionService";
import { IValidationService, IValidationServiceOptions } from "./IValidationService";
import { ValidationService } from "./ValidationService";

export * from "./IConditionsService";
export * from "./ConditionService";

export function getConditionService(options: IConditionsServiceOptions): IConditionsService {
    return new ConditionService(options);
}

export function getValidationService(options: IValidationServiceOptions): IValidationService {
    return new ValidationService(options);
}
