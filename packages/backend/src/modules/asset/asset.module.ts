import { Module } from "@nestjs/common";
import { UploadModule } from "../upload/upload.module";
import { AssetController } from "./asset.controller";

@Module({
    controllers: [AssetController],
    imports: [UploadModule],
})
export class AssetModule {}
