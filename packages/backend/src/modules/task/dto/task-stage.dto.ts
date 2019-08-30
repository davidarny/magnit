import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class TaskStageDto<T = TaskStageDto<object>> extends PrimaryBaseDto<T> {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly finished: boolean;
    @ApiModelProperty({ description: "ISO date format" }) readonly deadline: string;
}
