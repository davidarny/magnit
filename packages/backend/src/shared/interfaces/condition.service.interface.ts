import { Condition } from "../../modules/template/entities/condition.entity";

export interface IConditionService {
    findByPuzzleId(id: string): Promise<Condition[]>;
}
