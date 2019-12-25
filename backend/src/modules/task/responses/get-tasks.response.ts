import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { TaskDto } from "../dto/task.dto";

export class GetTasksResponse extends BaseResponse {
    @ApiModelProperty({ description: "Total per status" }) readonly total: number;
    @ApiModelProperty({ description: "Total" }) readonly all: number;
    @ApiModelProperty({ type: [TaskDto] }) readonly tasks: TaskDto[];
}
