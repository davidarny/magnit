import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Validation } from "../entities/validation.entity";
import { IValidationService } from "../interfaces/validation.service.interface";

@Injectable()
export class ValidationService implements IValidationService {
    constructor(
        @InjectRepository(Validation) private readonly validationRepository: Repository<Validation>
    ) {}

    async findByPuzzleId(id: string) {
        return this.validationRepository.find({ where: { puzzle: { id } }, loadRelationIds: true });
    }
}
