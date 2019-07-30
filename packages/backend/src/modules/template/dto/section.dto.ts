import { PuzzleDto } from "./puzzle.dto";

export class SectionDto {
    readonly id: string;
    readonly order: number;
    readonly title: string;
    readonly description: string;
    readonly puzzles: PuzzleDto[];
}
