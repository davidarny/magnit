import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TaskExtendedBody } from "../bodies/task-extended.body";

export class GetTaskExtendedResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskExtendedBody }) readonly task: TaskExtendedBody;
}
