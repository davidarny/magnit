import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { GetCitiesForRegionResponse } from "./responses/get-cities-for-region.response";
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

    @Get("/regions/:region")
    @ApiOkResponse({
        type: GetCitiesForRegionResponse,
        description: "List of cities of current region",
    })
    async getCitiesForRegion(@Param("region") region: string) {
        const cities = await this.marketplaceService.getCitiesForRegion(region);
        return { success: 1, cities };
    }
}
