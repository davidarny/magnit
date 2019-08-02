import { Inject, Injectable } from "@nestjs/common";
import { Template } from "../entities/template.entity";
import { SectionService } from "./section.service";
import { ISectionService } from "../interfaces/section.service.interface";
import { PuzzleService } from "./puzzle.service";
import { IPuzzleService } from "../interfaces/puzzle.service.interface";
import { Puzzle } from "../entities/puzzle.entity";
import { IAssemblerService } from "../interfaces/assembler.service.interface";

@Injectable()
export class PuzzleAssemblerService implements IAssemblerService {
    constructor(
        @Inject(SectionService) private readonly sectionService: ISectionService,
        @Inject(PuzzleService) private readonly puzzleService: IPuzzleService,
    ) {}

    async assemble(template: Template): Promise<void> {
        template.sections = await this.sectionService.findByTemplateId(template.id);
        for (const section of template.sections || []) {
            section.puzzles = await this.puzzleService.findBySectionId(section.id);
        }
        const puzzles: Puzzle[] = [
            ...template.sections.reduce((prev, curr) => [...prev, ...curr.puzzles], []),
        ];
        for (const puzzle of puzzles) {
            if (puzzle.puzzles && puzzle.puzzles.length) {
                puzzle.puzzles = await this.puzzleService.findByParentId(puzzle.id);
            }
        }
    }
}
