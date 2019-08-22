import { ApiModelProperty } from "@nestjs/swagger";

export class TaskStageDto {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly finished: boolean;
    @ApiModelProperty({ description: "ISO date format" }) readonly due_date: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
