import { ConditionDto } from "./condition.dto";
import { ValidationDto } from "./validation.dto";
import { TPuzzleType } from "../../../shared/entities/puzzle.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class PuzzleDto {
    @ApiModelProperty() readonly id: string;
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty() readonly order: number;
    @ApiModelProperty({
        enum: [
            "group",
            "question",
            "radio_answer",
            "checkbox_answer",
            "dropdown_answer",
            "upload_files",
            "date_answer",
            "text_answer",
            "numeric_answer",
            "reference_text",
            "reference_asset",
        ],
    })
    readonly puzzle_type: TPuzzleType;
    @ApiModelProperty({ type: [ConditionDto] }) readonly conditions: ConditionDto[];
    @ApiModelProperty({ type: [ValidationDto] }) readonly validations: ValidationDto[];
    @ApiModelProperty({ type: [PuzzleDto] }) readonly puzzles: PuzzleDto[];
}
