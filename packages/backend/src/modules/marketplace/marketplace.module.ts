import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AirwatchAuthModule } from "../auth/airwatch.auth.module";
import { PushTokenModule } from "../push-token/push-token.module";
import { Marketplace } from "./entities/marketplace.entity";
import { MarketplaceController } from "./marketplace.controller";
import { MarketplaceService } from "./services/marketplace.service";

@Module({
    imports: [TypeOrmModule.forFeature([Marketplace]), PushTokenModule, AirwatchAuthModule],
    controllers: [MarketplaceController],
    providers: [MarketplaceService],
    exports: [MarketplaceService],
})
export class MarketplaceModule {}
