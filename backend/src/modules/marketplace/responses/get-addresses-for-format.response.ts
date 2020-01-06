import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class GetAddressesForFormatResponse extends BaseResponse {
    @ApiModelProperty({ type: [String], description: "List of addresses for current format" })
    readonly addresses: string[];
}
