import { Validation } from "../../modules/template/entities/validation.entity";

export interface IValidationService {
    findByPuzzleId(id: string): Promise<Validation[]>;
}
