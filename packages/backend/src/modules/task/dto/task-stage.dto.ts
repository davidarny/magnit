import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";

export class TaskStageDto extends BaseDto {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly finished: boolean;
    @ApiModelProperty({ description: "ISO date format" }) readonly due_date: string;
}
