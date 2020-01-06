import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class GetFormatsForCityResponse extends BaseResponse {
    @ApiModelProperty({ type: [String], description: "List of formats for current city" })
    readonly formats: string[];
}
