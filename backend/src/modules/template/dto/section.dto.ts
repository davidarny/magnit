import { PuzzleDto } from "./puzzle.dto";
import { ApiModelProperty } from "@nestjs/swagger";

export class SectionDto {
    @ApiModelProperty() readonly id: string;
    @ApiModelProperty() readonly order: number;
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ type: [PuzzleDto] }) readonly puzzles: PuzzleDto[];
}
