import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TaskExtendedDto } from "../dto/task-extended.dto";

export class GetTaskExtendedResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskExtendedDto }) readonly task: TaskExtendedDto;
}
