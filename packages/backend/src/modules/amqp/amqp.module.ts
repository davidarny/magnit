import { Module } from "@nestjs/common";
import { AmqpModule as NestAmqpModule } from "nestjs-amqp";
import { AmqpService } from "./services/amqp.service";

const config = require("../../../amqpconfig");

const imports = [NestAmqpModule.forRoot(config)];

const providers = [AmqpService];

@Module({ imports, providers })
export class AmqpModule {}
