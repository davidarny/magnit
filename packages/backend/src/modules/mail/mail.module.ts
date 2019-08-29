import { ISendMailOptions, MailerModule } from "@nest-modules/mailer";
import { Inject, Logger, Module } from "@nestjs/common";
import { ConsumeMessage } from "amqplib";
import { AmqpModule } from "../amqp/amqp.module";
import { IAmqpService } from "../amqp/interfaces/amqp.service.interface";
import { AmqpService } from "../amqp/services/amqp.service";
import { IScheduleService } from "../schedule/interfaces/schedule.service.interface";
import { ScheduleModule } from "../schedule/schedule.module";
import { ScheduleService } from "../schedule/services/schedule.service";
import { ITaskService } from "../task/interfaces/task.service.interface";
import { TaskService } from "../task/services/task.service";
import { TaskModule } from "../task/task.module";
import { IMailMessage } from "./interfaces/mail-message.interface";
import { IMailService } from "./interfaces/mail.service.interface";
import { IScheduleMessage } from "./interfaces/schedule-message.interface";
import { MailService } from "./services/mail.service";

const config = require("../../../mailconfig");

@Module({
    imports: [MailerModule.forRoot(config), AmqpModule, ScheduleModule, TaskModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
    private readonly logger = new Logger(MailModule.name);

    constructor(
        @Inject(AmqpService) private readonly amqpService: IAmqpService,
        @Inject(ScheduleService) private readonly scheduleService: IScheduleService,
        @Inject(MailService) private readonly mailService: IMailService,
        @Inject(TaskService) private readonly taskService: ITaskService,
    ) {
        this.consumeEmailQueue().catch(this.logger.error);
        this.consumeScheduleQueue().catch(this.logger.error);
        this.consumeCancelScheduleQueue().catch(this.logger.error);
    }

    async consumeCancelScheduleQueue() {
        const channel = await this.amqpService.createChannel();
        await channel.assertQueue(AmqpService.CANCEL_EMAIL_SCHEDULE);
        await channel.consume(AmqpService.CANCEL_EMAIL_SCHEDULE, async message => {
            const id = message.content.toString();
            this.scheduleService.cancelJob(this.getTaskJobName(id));
            channel.ack(message);
        });
    }

    async consumeScheduleQueue() {
        const channel = await this.amqpService.createChannel();
        await channel.assertQueue(AmqpService.SCHEDULE_EMAIL_QUEUE);
        await channel.consume(AmqpService.SCHEDULE_EMAIL_QUEUE, async message => {
            const body = this.decodeMessageContent<IScheduleMessage>(message);
            if (!body) {
                return channel.ack(message);
            }
            if (body.email && body.id && body.schedule) {
                try {
                    const taskJobName = this.getTaskJobName(body.id);
                    this.scheduleService.createJob(taskJobName, body.schedule, async () => {
                        const [task, report] = await this.taskService.getReport(body.id);
                        const buffer = this.taskService.getReportBuffer(report);
                        await channel.assertQueue(AmqpService.EMAIL_QUEUE);
                        await channel.sendToQueue(
                            "email",
                            Buffer.from(
                                JSON.stringify({
                                    email: body.email,
                                    buffer,
                                    subject: `Отчёт по заданию "${task.title}"`,
                                    filename: "report.xlsx",
                                }),
                            ),
                        );
                        return false;
                    });
                    this.logger.log(
                        `Task "${taskJobName}" scheduled for "${body.email}" with "${body.schedule}" schedule`,
                    );
                } catch (error) {
                    this.logger.error(`Cannot schedule Email job: ${error.message}`);
                    return channel.ack(message);
                }
            }
            channel.ack(message);
        });
    }

    async consumeEmailQueue() {
        const channel = await this.amqpService.createChannel();
        await channel.assertQueue(AmqpService.EMAIL_QUEUE);
        await channel.consume(AmqpService.EMAIL_QUEUE, async message => {
            const body = this.decodeMessageContent<IMailMessage>(message);
            if (!body) {
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

    private decodeMessageContent<T>(message: ConsumeMessage): T | undefined {
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

    private getTaskJobName(id: string): string {
        return `task_${id}`;
    }
}
