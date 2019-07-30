import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Condition } from "../entities/condition.entity";
import { Validation } from "../entities/validation.entity";

@Injectable()
export class ValidationService {
    constructor(
        @InjectRepository(Validation) private readonly validationRepository: Repository<Validation>
    ) {}

    async findByPuzzleId(id: string) {
        return this.validationRepository.find({ where: { puzzle: { id } }, loadRelationIds: true });
    }
}
