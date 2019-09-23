import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class GetCitiesForRegionResponse extends BaseResponse {
    @ApiModelProperty({ type: [String], description: "List of cities of current region" })
    readonly cities: string[];
}
