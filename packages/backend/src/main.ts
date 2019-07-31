import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(process.env.GLOBAL_CONTROLLER_PREFIX || "v1");
    await app.listen(process.env.BACKEND_PORT || 1337);
}

bootstrap().catch(console.error);
