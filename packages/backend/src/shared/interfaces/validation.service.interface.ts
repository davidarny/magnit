import { Validation } from "../entities/validation.entity";

export interface IValidationService {
    findByPuzzleId(id: string): Promise<Validation[]>;
}
