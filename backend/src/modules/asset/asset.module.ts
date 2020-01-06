import { Module } from "@nestjs/common";
import { AirwatchAuthModule } from "../auth/airwatch.auth.module";
import { PushTokenModule } from "../push-token/push-token.module";
import { UploadModule } from "../upload/upload.module";
import { AssetController } from "./asset.controller";

@Module({
    controllers: [AssetController],
    imports: [UploadModule, PushTokenModule, AirwatchAuthModule],
})
export class AssetModule {}
