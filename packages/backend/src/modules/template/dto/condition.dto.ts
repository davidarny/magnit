import { ApiModelProperty } from "@nestjs/swagger";

export class ConditionDto {
    @ApiModelProperty() readonly id: string;
    @ApiModelProperty() readonly order: number;
    @ApiModelProperty() readonly value: string;
    @ApiModelProperty() readonly question_puzzle: string;
    @ApiModelProperty() readonly answer_puzzle: string;
    @ApiModelProperty({
        enum: ["chosen_answer", "given_answer", "equal", "not_equal", "more_than", "less_than"],
    })
    readonly action_type: string;
    @ApiModelProperty({ enum: ["or", "and"] }) readonly condition_type: string;
}
