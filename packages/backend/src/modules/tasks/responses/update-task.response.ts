import { BaseResponse } from "../../../shared/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TaskDto } from "../dto/task.dto";

export class UpdateTaskResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskDto }) readonly task: TaskDto;
}
