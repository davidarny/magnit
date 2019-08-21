import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { FullTaskDto } from "../dto/task.dto";

export class GetTaskResponse extends BaseResponse {
    @ApiModelProperty({ type: FullTaskDto }) readonly task: FullTaskDto;
}
