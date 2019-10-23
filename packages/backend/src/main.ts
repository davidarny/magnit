import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cluster from "cluster";
import compression from "compression";
import { closeSync, existsSync, mkdirSync, openSync } from "fs";
import helmet from "helmet";
import * as os from "os";
import { join } from "path";
import "reflect-metadata";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./shared/filters/all-exceptions.filter";
import { LoggerFactory } from "./shared/providers/logger.factory";

const development = process.env.NODE_ENV === "development";

const pino = require("pino");
const logger = LoggerFactory.getLogger();

if (process.env.ALLOW_CLUSTER_MODE && cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);
    for (const i of os.cpus()) {
        cluster.fork();
    }
} else {
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

        // exceptions filter
        const { httpAdapter } = app.get(HttpAdapterHost);
        app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

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
            .setHost(
                process.env.NODE_ENV === "production"
                    ? "91.144.161.208:1336/v1"
                    : "localhost:1337/v1",
            )
            .setVersion("1.0")
            .addBearerAuth("basic", "header", "basic")
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

    bootstrap()
        .then(() => process.env.ALLOW_CLUSTER_MODE && logger.info(`Worker ${process.pid} started`))
        .catch(error => logger.error(error));
}
