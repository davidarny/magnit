import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as compression from "compression";
import { closeSync, existsSync, mkdirSync, openSync } from "fs";
import * as helmet from "helmet";
import { join } from "path";
import "reflect-metadata";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { AppModule } from "./app.module";

const development = process.env.NODE_ENV === "development";

const pino = require("pino");
const logger = pino({
    prettyPrint: development && {
        colorize: true,
        translateTime: true,
        levelFirst: true,
    },
});

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // logger
    app.use(require("express-pino-logger")({ logger }));
    const pathToLogs = join(__dirname, "..", "logs");
    if (development && !existsSync(pathToLogs)) {
        mkdirSync(pathToLogs);
        closeSync(openSync(join(pathToLogs, "magnit.log"), "w"));
        closeSync(openSync(join(pathToLogs, "ormlogs.log"), "w"));
    }

    // controller prefix
    app.setGlobalPrefix("v1");

    // security headers
    app.enableCors();
    app.use(helmet());
    app.use(compression());

    // code docs
    const pathToDocs = join(__dirname, "..", "docs");
    if (development && !existsSync(pathToDocs)) {
        mkdirSync(pathToDocs);
    }
    app.useStaticAssets(pathToDocs);

    // static assets
    const pathToStatics = join(__dirname, "..", "public");
    if (development && !existsSync(pathToStatics)) {
        mkdirSync(pathToStatics);
    }
    app.useStaticAssets(pathToStatics);

    // favicon
    const pathToFavicon = join(__dirname, "..", "assets");
    app.useStaticAssets(pathToFavicon);

    // api docs
    const config = new DocumentBuilder()
        .setTitle("Templates API")
        .setHost("91.144.161.208:1337/v1")
        .setVersion("1.0")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();

    // listen port
    await app.listen(process.env.BACKEND_PORT || 1337);
}

process.on(
    "uncaughtException",
    pino.final(logger, (error, final) => {
        final.error(error, "uncaughtException");
        process.exit(1);
    }),
);

process.on(
    "unhandledRejection",
    pino.final(logger, (err, final) => {
        final.error(err, "unhandledRejection");
        process.exit(1);
    }),
);

bootstrap().catch(error => logger.error(error));
