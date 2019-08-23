import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";
import { TaskStageDto } from "./task-stage.dto";

export class StageHistoryDto extends BaseDto {
    @ApiModelProperty({ description: "ISO date format" }) readonly date: string;
    @ApiModelProperty() readonly description: string;
}

export class FullStageHistoryDto extends StageHistoryDto {
    @ApiModelProperty({ type: TaskStageDto }) readonly stage: TaskStageDto;
}
