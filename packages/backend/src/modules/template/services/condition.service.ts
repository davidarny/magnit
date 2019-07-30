import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Condition } from "../entities/condition.entity";

@Injectable()
export class ConditionService {
    constructor(
        @InjectRepository(Condition) private readonly conditionRepository: Repository<Condition>
    ) {}

    async findByPuzzleId(id: string) {
        return this.conditionRepository.find({ where: { puzzle: { id } }, loadRelationIds: true });
    }
}
