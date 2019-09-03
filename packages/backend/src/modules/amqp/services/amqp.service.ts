import { Injectable, Logger } from "@nestjs/common";
import { Channel, Connection, ConsumeMessage } from "amqplib";
import { InjectAmqpConnection } from "nestjs-amqp";
import { IAmqpService } from "../interfaces/amqp.service.interface";

@Injectable()
export class AmqpService implements IAmqpService {
    private readonly logger = new Logger(AmqpService.name);

    static EMAIL_QUEUE = "email";
    static SCHEDULE_EMAIL_QUEUE = "schedule_email";
    static CANCEL_EMAIL_SCHEDULE = "cancel_email_schedule";
    static PUSH_NOTIFICATION = "push_notification";

    constructor(@InjectAmqpConnection() private readonly connection: Connection) {}

    async closeConnection(): Promise<void> {
        return this.connection.close();
    }

    async getAssertedChannelFor(queue: string): Promise<Channel> {
        const channel = await this.connection.createChannel();
        await channel.assertQueue(queue);
        return channel;
    }

    decodeMessageContent<T>(message: ConsumeMessage): T | undefined {
        const content = message.content;
        let string: string;
        try {
            string = content.toString();
        } catch (error) {
            this.logger.error(`Cannot decode AMQP content: ${error.message}`);
            return;
        }
        let body: T;
        try {
            body = JSON.parse(string);
        } catch (error) {
            this.logger.error(`Cannot parse AMQP content: ${error.message}`);
            return;
        }
        return body;
    }
}
