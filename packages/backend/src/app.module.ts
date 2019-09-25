import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from "path";
import { ConnectionOptionsReader } from "typeorm";
import { AssetModule } from "./modules/asset/asset.module";
import { AirwatchAuthModule } from "./modules/auth/airwatch.auth.module";
import { MailModule } from "./modules/mail/mail.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { PushTokenModule } from "./modules/push-token/push-token.module";
import { TaskModule } from "./modules/task/task.module";
import { TemplateModule } from "./modules/template/template.module";
import { CustomFileLogger } from "./shared/providers/custom.file.logger";
import { UserModule } from "./modules/user/user.module";

const reader = new ConnectionOptionsReader({ root: resolve(__dirname, "..") });

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                ...(await reader.get("default")),
                entities: [__dirname + "/**/*.entity{.ts,.js}"],
                ...(process.env.NODE_ENV === "production"
                    ? { logger: new CustomFileLogger("all") }
                    : {}),
            }),
        }),
        TemplateModule,
        UserModule,
        TaskModule,
        AssetModule,
        MailModule,
        PushTokenModule,
        MarketplaceModule,
        ...(process.env.ALLOW_AUTH ? [AirwatchAuthModule] : []),
    ],
})
export class AppModule {}
