import { BaseResponse } from "./base.response";
import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateTemplateResponse extends BaseResponse {
    @ApiModelProperty() readonly template_id: string;
}
