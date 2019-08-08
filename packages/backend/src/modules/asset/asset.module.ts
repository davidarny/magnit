import { Module } from "@nestjs/common";
import { AssetController } from "./asset.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { createHash } from "crypto";

const MAX_HASH_LENGTH = 28;

const controllers = [AssetController];
const imports = [
    MulterModule.register({
        storage: diskStorage({
            destination: "./public",
            filename(
                req: Express.Request,
                file: Express.Multer.File,
                callback: (error: Error | null, filename: string) => void,
            ): void {
                callback(
                    null,
                    `${createHash("sha256")
                        .update(new Date().valueOf().toString() + Math.random().toString())
                        .digest("hex")
                        .toString()
                        .substring(0, MAX_HASH_LENGTH)}${extname(file.originalname)}`,
                );
            },
        }),
    }),
];

@Module({ controllers, imports })
export class AssetModule {}
