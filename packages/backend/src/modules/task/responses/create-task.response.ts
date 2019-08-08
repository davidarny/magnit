import { BaseResponse } from "../../../shared/responses/base.response";
import { ApiModelProperty } from "@nestjs/swagger";

export class CreateTaskResponse extends BaseResponse {
    @ApiModelProperty() readonly task_id: string;
}
