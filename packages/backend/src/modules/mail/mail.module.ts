import { ISendMailOptions, MailerModule } from "@nest-modules/mailer";
import { Inject, Logger, Module } from "@nestjs/common";
import { AmqpModule } from "../amqp/amqp.module";
import { IAmqpService } from "../amqp/interfaces/amqp.service.interface";
import { AmqpService } from "../amqp/services/amqp.service";
import { IMailMessage } from "./interfaces/mail-message.interface";
import { IMailService } from "./interfaces/mail.service.interface";
import { MailService } from "./services/mail.service";

const config = require("../../../mailconfig");

@Module({
    imports: [MailerModule.forRoot(config), AmqpModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
    private readonly logger = new Logger(MailModule.name);

    constructor(
        @Inject(AmqpService) private readonly amqpService: IAmqpService,
        @Inject(MailService) private readonly mailService: IMailService,
    ) {
        this.init().catch(this.logger.error);
    }

    async init() {
        const channel = await this.amqpService.createChannel();
        await channel.assertQueue(AmqpService.EMAIL_QUEUE);
        await channel.consume(AmqpService.EMAIL_QUEUE, async message => {
            const content = message.content;
            let string: string;
            try {
                string = content.toString();
            } catch (error) {
                this.logger.error(`Cannot decode AMQP content: ${error.message}`);
                return channel.ack(message);
            }
            let body: IMailMessage;
            try {
                body = JSON.parse(string);
            } catch (error) {
                this.logger.error(`Cannot parse AMQP content: ${error.message}`);
                return channel.ack(message);
            }
            if (!body.email) {
                this.logger.error("No recipients defined");
            }
            const options: ISendMailOptions = { to: body.email };
            if (body.buffer && body.buffer.data && body.filename) {
                options.attachments = [
                    {
                        filename: body.filename,
                        content: Buffer.from(body.buffer.data),
                    },
                ];
            }
            if (body.subject) {
                options.subject = body.subject;
            }
            try {
                await this.mailService.send(options);
                this.logger.log(`Successfully sent Email for "${options.to}"`);
            } catch (error) {
                this.logger.error(`Cannot send Email: ${error.message}`);
                return channel.ack(message);
            }
            channel.ack(message);
        });
    }
}
