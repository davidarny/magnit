import { NestFactory } from "@nestjs/core";
import * as helmet from "helmet";
import * as compression from "compression";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // controller prefix
    app.setGlobalPrefix(process.env.GLOBAL_CONTROLLER_PREFIX || "v1");

    // security headers
    app.enableCors();
    app.use(helmet());
    app.use(compression());

    // code docs
    const pathToDocs = join(__dirname, "..", "docs");
    if (existsSync(pathToDocs)) {
        app.useStaticAssets(pathToDocs);
    }

    // static assets
    const pathToStatics = join(__dirname, "..", "public");
    if (!existsSync(pathToStatics)) {
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

    // listen port
    await app.listen(process.env.BACKEND_PORT || 1337);
}

bootstrap().catch(console.error);
