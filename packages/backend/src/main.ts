import { NestFactory } from "@nestjs/core";
import * as helmet from "helmet";
import * as compression from "compression";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(process.env.GLOBAL_CONTROLLER_PREFIX || "v1");
    app.enableCors();
    app.use(helmet());
    app.use(compression());
    await app.listen(process.env.BACKEND_PORT || 1337);
}

bootstrap().catch(console.error);
