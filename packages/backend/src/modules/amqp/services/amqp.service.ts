import { Injectable } from "@nestjs/common";
import { Channel, Connection } from "amqplib";
import { InjectAmqpConnection } from "nestjs-amqp";
import { IAmqpService } from "../interfaces/amqp.service.interface";

@Injectable()
export class AmqpService implements IAmqpService {
    static EMAIL_QUEUE = "email";
    static SCHEDULE_EMAIL_QUEUE = "schedule_email";
    static CANCEL_EMAIL_SCHEDULE = "cancel_email_schedule";

    constructor(@InjectAmqpConnection() private readonly connection: Connection) {}

    async closeConnection(): Promise<void> {
        return this.connection.close();
    }

    async createChannel(): Promise<Channel> {
        return this.connection.createChannel();
    }
}
