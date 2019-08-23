import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { StageHistoryDto } from "../dto/stage-history.dto";
import { TaskStageDto } from "../dto/task-stage.dto";

class TaskStageWithHistoryDto extends TaskStageDto {
    @ApiModelProperty({ type: [StageHistoryDto] }) readonly history: StageHistoryDto[];
}

export class GetStagesWithFullHistoryResponse extends BaseResponse {
    @ApiModelProperty({ type: [TaskStageWithHistoryDto] })
    readonly stages: TaskStageWithHistoryDto[];
}
