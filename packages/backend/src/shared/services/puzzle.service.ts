import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Puzzle } from "../entities/puzzle.entity";
import { IPuzzleService } from "../interfaces/puzzle.service.interface";
import { PuzzleDto } from "../../modules/template/dto/puzzle.dto";
import { Section } from "../entities/section.entity";
import { Template } from "../entities/template.entity";
import { Condition } from "../entities/condition.entity";
import { Validation } from "../entities/validation.entity";

@Injectable()
export class PuzzleService implements IPuzzleService {
    constructor(@InjectRepository(Puzzle) private readonly puzzleRepository: Repository<Puzzle>) {}

    async findBySectionId(id: string) {
        return this.puzzleRepository.find({
            where: { section: { id }, parent: null },
            relations: ["conditions", "validations"],
            order: { order: "ASC" },
        });
    }

    async findByParentId(id: string) {
        return this.puzzleRepository.find({
            where: { parent: { id } },
            order: { order: "ASC" },
            relations: ["conditions", "validations"],
        });
    }

    deeplyCreatePuzzles(
        puzzles: Puzzle[],
        puzzleDtoArray: PuzzleDto[],
        section: Section,
        template: Template,
        parent?: Puzzle,
    ) {
        for (const puzzleDto of puzzleDtoArray || []) {
            const puzzle = new Puzzle(puzzleDto);
            puzzle.conditions = [];
            puzzle.validations = [];

            for (const conditionDto of puzzleDto.conditions || []) {
                if (!conditionDto.question_puzzle) {
                    continue;
                }
                const condition = new Condition(conditionDto);
                puzzle.conditions.push(condition);
                condition.puzzle = puzzle;
            }

            for (const validationDto of puzzleDto.validations || []) {
                if (!validationDto.left_hand_puzzle) {
                    continue;
                }
                const validation = new Validation(validationDto);
                puzzle.validations.push(validation);
                validation.puzzle = puzzle;
            }

            if (parent) {
                puzzle.parent = parent;
            }

            this.deeplyCreatePuzzles(puzzles, puzzleDto.puzzles, section, template, puzzle);

            puzzles.push(puzzle);
        }
    }
}
