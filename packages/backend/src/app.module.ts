import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from "path";
import { ConnectionOptionsReader } from "typeorm";
import { APP_PIPE } from "@nestjs/core";
import { AssetModule } from "./modules/asset/asset.module";
import { MailModule } from "./modules/mail/mail.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { PushTokenModule } from "./modules/push-token/push-token.module";
import { TaskModule } from "./modules/task/task.module";
import { TemplateModule } from "./modules/template/template.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomFileLogger } from "./shared/providers/custom.file.logger";
import { UserModule } from "./modules/user/user.module";
import { ValidationPipe } from "./shared/pipes/validation.pipe";

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
        AuthModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule {}
