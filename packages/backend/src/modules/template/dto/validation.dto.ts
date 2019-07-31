import { TOperatorType, TValidationType } from "../entities/validation.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class ValidationDto {
    @ApiModelProperty() readonly id: string;
    @ApiModelProperty() readonly order: number;
    @ApiModelProperty({ enum: ["compare_with_answer", "set_value"] })
    readonly validation_type: TValidationType;
    @ApiModelProperty({
        enum: ["less_than", "more_than", "equal", "less_or_equal", "more_or_equal"],
    })
    readonly operator_type: TOperatorType;
    @ApiModelProperty() readonly error_message: string;
    @ApiModelProperty() readonly left_hand_puzzle: string;
    @ApiModelProperty() readonly value?: string;
    @ApiModelProperty() readonly right_hand_puzzle?: string;
}
