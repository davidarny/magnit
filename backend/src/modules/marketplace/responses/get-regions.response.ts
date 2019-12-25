import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class GetRegionsResponse extends BaseResponse {
    @ApiModelProperty({ type: [String], description: "List of regions" })
    readonly regions: string[];
}
