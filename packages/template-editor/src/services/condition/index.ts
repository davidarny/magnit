import { IValidationService, IValidationServiceOptions } from "./IValidationService";
import { ValidationService } from "./ValidationService";

export function getValidationService(options: IValidationServiceOptions): IValidationService {
    return new ValidationService(options);
}
