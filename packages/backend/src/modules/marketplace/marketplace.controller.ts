import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { AirwatchAuthGuard } from "../auth/guards/airwatch.auth.guard";
import { GetAddressesForFormatResponse } from "./responses/get-addresses-for-format.response";
import { GetCitiesForRegionResponse } from "./responses/get-cities-for-region.response";
import { GetFormatsForCityResponse } from "./responses/get-formats-for-city.response";
import { GetRegionsResponse } from "./responses/get-regions.response";
import { MarketplaceService } from "./services/marketplace.service";

@ApiBearerAuth()
@UseGuards(AirwatchAuthGuard)
@ApiUseTags("marketplaces")
@Controller("marketplaces")
export class MarketplaceController {
    constructor(private readonly marketplaceService: MarketplaceService) {}

    @Get("/regions")
    @ApiOkResponse({ type: GetRegionsResponse, description: "List of regions" })
    async getAllRegions() {
        const regions = await this.marketplaceService.getAllRegions();
        return { success: 1, regions };
    }

    @Get("/regions/:region/cities")
    @ApiOkResponse({
        type: GetCitiesForRegionResponse,
        description: "List of cities of current region",
    })
    async getCitiesForRegion(@Param("region") region: string) {
        const cities = await this.marketplaceService.getCitiesForRegion(region);
        return { success: 1, cities };
    }

    @Get("/regions/:region/cities/:city/formats")
    @ApiOkResponse({
        type: GetFormatsForCityResponse,
        description: "Get formats for current city",
    })
    async getFormatsForCity(@Param("region") region: string, @Param("city") city: string) {
        const formats = await this.marketplaceService.getFormatForCity(region, city);
        return { success: 1, formats };
    }

    @Get("/regions/:region/cities/:city/formats/:format")
    @ApiOkResponse({
        type: GetAddressesForFormatResponse,
        description: "Get addresses for current city",
    })
    async getAddressesForCity(
        @Param("region") region: string,
        @Param("city") city: string,
        @Param("format") format: string,
    ) {
        const addresses = await this.marketplaceService.getAddressForFormat(region, city, format);
        return { success: 1, addresses };
    }
}
