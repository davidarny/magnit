import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class CreateTemplateResponse extends BaseResponse {
    @ApiModelProperty() readonly template_id: string;
}
