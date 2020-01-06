import { Module } from "@nestjs/common";
import { AmqpModule as NestAmqpModule } from "nestjs-amqp";
import { AmqpService } from "./services/amqp.service";

const config = require("../../../amqpconfig");

@Module({
    imports: [...(process.env.NODE_ENV !== "testing" ? [NestAmqpModule.forRoot(config)] : [])],
    providers: [AmqpService],
    exports: [AmqpService],
})
export class AmqpModule {}
