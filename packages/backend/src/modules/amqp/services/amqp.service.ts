import { Injectable } from "@nestjs/common";
import { Channel, Connection } from "amqplib";
import { InjectAmqpConnection } from "nestjs-amqp";
import { IAmqpService } from "../interfaces/amqp.service.interface";

@Injectable()
export class AmqpService implements IAmqpService {
    static EMAIL_QUEUE = "email";

    constructor(@InjectAmqpConnection() private readonly connection: Connection) {}

    async closeConnection(): Promise<void> {
        return this.connection.close();
    }

    async createChannel(): Promise<Channel> {
        return this.connection.createChannel();
    }
}
