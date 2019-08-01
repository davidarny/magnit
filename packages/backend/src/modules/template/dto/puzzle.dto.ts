import { ConditionDto } from "./condition.dto";
import { ValidationDto } from "./validation.dto";
import { TAnswerType, TPuzzleType } from "../../../shared/entities/puzzle.entity";
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
            "reference_answer",
            "upload_files",
            "date_answer",
            "text_answer",
            "numeric_answer",
        ],
    })
    readonly puzzle_type: TPuzzleType;
    @ApiModelProperty({ enum: ["number", "string"] }) readonly answer_type: TAnswerType;
    @ApiModelProperty({ type: [ConditionDto] }) readonly conditions: ConditionDto[];
    @ApiModelProperty({ type: [ValidationDto] }) readonly validations: ValidationDto[];
    @ApiModelProperty({ type: [PuzzleDto] }) readonly puzzles: PuzzleDto[];
}
