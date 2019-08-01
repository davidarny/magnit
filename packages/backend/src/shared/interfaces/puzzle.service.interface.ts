import { Puzzle } from "../../modules/template/entities/puzzle.entity";

export interface IPuzzleService {
    findBySectionId(id: string): Promise<Puzzle[]>;

    findByParentId(id: string): Promise<Puzzle[]>;
}
