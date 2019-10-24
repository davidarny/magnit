import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TaskStageDto } from "./task-stage.dto";

export class StageHistoryDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly description: string;
}

export class FullStageHistoryDto extends StageHistoryDto {
    @ApiModelProperty({ type: TaskStageDto }) readonly stage: TaskStageDto;
}
