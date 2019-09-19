import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { GetRegionsResponse } from "./responses/get-regions.response";
import { MarketplaceService } from "./services/marketplace.service";

@ApiUseTags("marketplace")
@ApiBearerAuth()
@Controller("marketplace")
export class MarketplaceController {
    constructor(private readonly marketplaceService: MarketplaceService) {}

    @Get("/regions")
    @ApiOkResponse({ type: GetRegionsResponse, description: "List of regions" })
    async getAllRegions() {
        const regions = await this.marketplaceService.getAllRegions();
        return { success: 1, regions };
    }
}
