import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/base.response";

export class GetTemplateResponse extends BaseResponse {
    @ApiModelProperty({ description: "Stringified JSON" }) readonly template: string;
}
