import { ApiModelProperty } from "@nestjs/swagger";
import { TaskDto } from "../dto/task.dto";
import { BaseResponse } from "../../../shared/base.response";

export class GetTasksResponse extends BaseResponse {
    @ApiModelProperty() readonly total: number;
    @ApiModelProperty({ type: [TaskDto] }) readonly tasks: TaskDto[];
}
