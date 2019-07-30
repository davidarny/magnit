import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { TemplateModule } from "./modules/template/template.module";
import { LoggerMiddleware } from "./middleware/logger.middleware";

const options: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "magnit",
    password: "magnit",
    database: "magnit",
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true,
};

const imports = [TypeOrmModule.forRoot(options), TemplateModule];

@Module({ imports })
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        if (process.env.NODE_ENV !== "testing") {
            consumer.apply(LoggerMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
        }
    }
}
