import { NestFactory } from "@nestjs/core";
import * as helmet from "helmet";
import * as compression from "compression";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { existsSync } from "fs";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // controller prefix
    app.setGlobalPrefix(process.env.GLOBAL_CONTROLLER_PREFIX || "v1");

    // security headers
    app.enableCors();
    app.use(helmet());
    app.use(compression());

    // serve docs
    const pathToDocs = join(__dirname, "..", "docs");
    if (existsSync(pathToDocs)) {
        app.useStaticAssets(pathToDocs);
    }

    // listen port
    await app.listen(process.env.BACKEND_PORT || 1337);
}

bootstrap().catch(console.error);
