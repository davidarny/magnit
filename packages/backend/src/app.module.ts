import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateModule } from "./modules/template/template.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { TaskModule } from "./modules/task/task.module";
import { AssetModule } from "./modules/asset/asset.module";
import { ConnectionOptionsReader } from "typeorm";
import { resolve } from "path";

const reader = new ConnectionOptionsReader({ root: resolve(__dirname, "..") });

const imports = [
    TypeOrmModule.forRootAsync({
        useFactory: async () => ({
            ...(await reader.get("default")),
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
        }),
    }),
    CacheModule.register(),
    TemplateModule,
    TaskModule,
    AssetModule,
];

@Module({ imports })
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        if (process.env.NODE_ENV !== "testing") {
            consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
        }
    }
}
