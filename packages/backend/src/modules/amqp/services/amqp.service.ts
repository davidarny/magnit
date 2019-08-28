import { Injectable } from "@nestjs/common";
import { Channel, Connection } from "amqplib";
import { InjectAmqpConnection } from "nestjs-amqp";
import { IAmqpService } from "../interfaces/amqp.service.interface";

@Injectable()
export class AmqpService implements IAmqpService {
    constructor(@InjectAmqpConnection() private readonly connection: Connection) {}

    async close(): Promise<void> {
        return this.connection.close();
    }

    async createChannel(): Promise<Channel> {
        return this.connection.createChannel();
    }
}
