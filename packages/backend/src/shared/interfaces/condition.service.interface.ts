import { Condition } from "../entities/condition.entity";

export interface IConditionService {
    findByPuzzleId(id: string): Promise<Condition[]>;
}
