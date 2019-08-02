import { Puzzle } from "../entities/puzzle.entity";
import { PuzzleDto } from "../../modules/template/dto/puzzle.dto";
import { Section } from "../entities/section.entity";
import { Template } from "../entities/template.entity";

export interface IPuzzleService {
    findBySectionId(id: string): Promise<Puzzle[]>;

    findByParentId(id: string): Promise<Puzzle[]>;

    deeplyCreatePuzzles(
        puzzles: Puzzle[],
        puzzleDtoArray: PuzzleDto[],
        section: Section,
        template: Template,
        parent?: Puzzle,
    ): void;
}
