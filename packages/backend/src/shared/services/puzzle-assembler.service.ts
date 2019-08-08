import { Inject, Injectable } from "@nestjs/common";
import { Template } from "../entities/template.entity";
import { SectionService } from "./section.service";
import { ISectionService } from "../interfaces/section.service.interface";
import { PuzzleService } from "./puzzle.service";
import { IPuzzleService } from "../interfaces/puzzle.service.interface";
import { Puzzle } from "../entities/puzzle.entity";
import { IAssemblerService } from "../interfaces/assembler.service.interface";

interface IPuzzle {
    puzzles: IPuzzle[];
}

@Injectable()
export class PuzzleAssemblerService implements IAssemblerService {
    constructor(
        @Inject(SectionService) private readonly sectionService: ISectionService,
        @Inject(PuzzleService) private readonly puzzleService: IPuzzleService,
    ) {}

    // TODO: need optimization
    // maybe better to use "relations"
    // and then just walk the tree & sort by "order"
    async assemble(template: Template): Promise<void> {
        template.sections = await this.sectionService.findByTemplateId(template.id);
        for (const section of template.sections || []) {
            section.puzzles = await this.puzzleService.findBySectionId(section.id);
        }
        const puzzles = this.flatMapDeeply(template.sections);
        for (const puzzle of puzzles) {
            await this.deeplyAssemblePuzzlesChildren(puzzle);
        }
    }

    private flatMapDeeply(puzzles: IPuzzle[]) {
        return puzzles.reduce(
            (prev, curr) => [
                ...prev,
                ...(curr.puzzles || []),
                ...this.flatMapDeeply(curr.puzzles || []),
            ],
            [],
        );
    }

    private async deeplyAssemblePuzzlesChildren(puzzle: Puzzle) {
        puzzle.puzzles = await this.puzzleService.findByParentId(puzzle.id);
        for (const child of puzzle.puzzles) {
            await this.deeplyAssemblePuzzlesChildren(child);
        }
    }
}
