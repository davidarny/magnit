import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TaskDto } from "../dto/task.dto";

export class GetTaskResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskDto }) readonly task: TaskDto;
}