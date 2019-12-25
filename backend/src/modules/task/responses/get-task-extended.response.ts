import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { ExtendedTaskDto } from "../dto/task.dto";

export class GetTaskExtendedResponse extends BaseResponse {
    @ApiModelProperty({ type: ExtendedTaskDto })
    readonly task: ExtendedTaskDto;
}
