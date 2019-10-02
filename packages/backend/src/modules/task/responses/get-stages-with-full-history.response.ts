import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { BaseResponse } from "../../../shared/responses/base.response";
import { StageHistoryDto } from "../dto/stage-history.dto";
import { TaskStageDto } from "../dto/task-stage.dto";

class TaskStageWithHistoryDto extends TaskStageDto {
    constructor(dto?: DeepPartial<TaskStageWithHistoryDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty({ type: [StageHistoryDto] }) readonly history: StageHistoryDto[];
}

export class GetStagesWithFullHistoryResponse extends BaseResponse {
    @ApiModelProperty({ type: [TaskStageWithHistoryDto] })
    readonly stages: TaskStageWithHistoryDto[];
}
