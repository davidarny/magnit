import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TaskWithTemplatesExtendedDto } from "../dto/task.dto";

export class GetTaskExtendedResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskWithTemplatesExtendedDto })
    readonly task: TaskWithTemplatesExtendedDto;
}
