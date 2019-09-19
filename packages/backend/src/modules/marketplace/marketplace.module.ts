import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Marketplace } from "./entities/marketplace.entity";
import { MarketplaceController } from "./marketplace.controller";
import { MarketplaceService } from "./services/marketplace.service";

@Module({
    imports: [TypeOrmModule.forFeature([Marketplace])],
    controllers: [MarketplaceController],
    providers: [MarketplaceService],
})
export class MarketplaceModule {}
