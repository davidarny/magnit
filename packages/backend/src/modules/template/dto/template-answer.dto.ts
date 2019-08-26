import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";

export class TemplateAnswerDto extends BaseDto {
    @ApiModelProperty({ description: "UUID" }) readonly id_puzzle: string;
    @ApiModelProperty() readonly id_template: number;
    @ApiModelProperty({ description: "Can be text, number-like text or filename" })
    readonly answer: string;
    @ApiModelProperty({
        enum: [
            "radio_answer",
            "checkbox_answer",
            "dropdown_answer",
            "upload_files",
            "date_answer",
            "text_answer",
            "numeric_answer",
            "reference_answer",
        ],
    })
    readonly answer_type: string;
    @ApiModelProperty() readonly comment: string;
}
