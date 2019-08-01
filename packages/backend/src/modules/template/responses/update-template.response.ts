import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/base.response";

export class UpdateTemplateResponse extends BaseResponse {
    @ApiModelProperty() readonly template_id: string;
}
