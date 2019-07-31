import { BaseResponse } from "./base.response";
import { ApiModelProperty } from "@nestjs/swagger";

export class GetTemplateResponse extends BaseResponse {
    @ApiModelProperty({ description: "Stringified JSON" }) readonly template: string;
}
