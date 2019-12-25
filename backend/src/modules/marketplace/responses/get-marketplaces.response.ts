import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { MarketplaceDto } from "../dto/marketplace.dto";

export class GetMarketplacesResponse extends BaseResponse {
    @ApiModelProperty({ type: [MarketplaceDto] }) readonly marketplaces: MarketplaceDto[];
}
