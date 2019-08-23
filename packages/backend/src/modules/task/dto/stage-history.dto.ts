import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";
import { TaskStageDto } from "./task-stage.dto";

export class StageHistoryDto extends BaseDto {
    @ApiModelProperty() readonly description: string;
}

export class FullStageHistoryDto extends StageHistoryDto {
    @ApiModelProperty({ type: TaskStageDto }) readonly stage: TaskStageDto;
}
