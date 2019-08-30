import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TaskStageDto } from "./task-stage.dto";

export class StageHistoryDto<T = StageHistoryDto<object>> extends PrimaryBaseDto<StageHistoryDto> {
    @ApiModelProperty() readonly description: string;
}

export class FullStageHistoryDto extends StageHistoryDto<StageHistoryDto> {
    @ApiModelProperty({ type: TaskStageDto }) readonly stage: TaskStageDto;
}
