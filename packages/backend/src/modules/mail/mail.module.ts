import { ISendMailOptions, MailerModule } from "@nest-modules/mailer";
import { Logger, Module } from "@nestjs/common";
import { AmqpModule } from "../amqp/amqp.module";
import { AmqpService } from "../amqp/services/amqp.service";
import { ScheduleModule } from "../schedule/schedule.module";
import { ScheduleService } from "../schedule/services/schedule.service";
import { TaskService } from "../task/services/task.service";
import { TaskModule } from "../task/task.module";
import { IMailMessage } from "./interfaces/mail-message.interface";
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
        private readonly amqpService: AmqpService,
        private readonly scheduleService: ScheduleService,
        private readonly mailService: MailService,
        private readonly taskService: TaskService,
    ) {
        this.consumeEmailQueue().catch(this.logger.error);
        this.consumeScheduleQueue().catch(this.logger.error);
        this.consumeCancelScheduleQueue().catch(this.logger.error);
    }

    private async consumeCancelScheduleQueue() {
        const channel = await this.amqpService.getAssertedChannelFor(
            AmqpService.CANCEL_EMAIL_SCHEDULE,
        );
        await channel.consume(AmqpService.CANCEL_EMAIL_SCHEDULE, async message => {
            const id = message.content.toString();
            this.scheduleService.cancelJob(getTaskJobName(Number(id)));
            channel.ack(message);
        });
    }

    private async consumeScheduleQueue() {
        const channel = await this.amqpService.getAssertedChannelFor(
            AmqpService.SCHEDULE_EMAIL_QUEUE,
        );
        await channel.consume(AmqpService.SCHEDULE_EMAIL_QUEUE, async message => {
            const body = this.amqpService.decodeMessageContent<IScheduleMessage>(message);
            if (!body) {
                return channel.ack(message);
            }
            if (body.email && body.id && body.schedule) {
                try {
                    const taskJobName = getTaskJobName(body.id);
                    this.scheduleService.createJob(taskJobName, body.schedule, async () => {
                        const [task, report] = await this.taskService.getReport(body.id);
                        const buffer = this.taskService.getReportBuffer(report);
                        await channel.assertQueue(AmqpService.EMAIL_QUEUE);
                        const oayload: IMailMessage = {
                            email: body.email,
                            buffer,
                            subject: `Отчёт по заданию "${task.title}"`,
                            filename: "report.xlsx",
                        };
                        await channel.sendToQueue("email", Buffer.from(JSON.stringify(oayload)));
                        return false;
                    });
                    this.logger.log(
                        `Task "${taskJobName}" scheduled for "${body.email}" with "${body.schedule}" schedule`,
                    );
                } catch (error) {
                    this.logger.error(`Cannot schedule Email job: ${error.message}`);
                }
            }
            channel.ack(message);
        });
    }

    private async consumeEmailQueue() {
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.EMAIL_QUEUE);
        await channel.consume(AmqpService.EMAIL_QUEUE, async message => {
            const body = this.amqpService.decodeMessageContent<IMailMessage>(message);
            if (!body) {
                return channel.ack(message);
            }
            if (!body.email) {
                this.logger.error("No recipients defined");
            }
            const options: ISendMailOptions = { to: body.email };
            if (
                body.buffer &&
                // check if buffer is stringified before
                !(body.buffer instanceof Buffer) &&
                body.buffer.data &&
                body.filename
            ) {
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
            }
            channel.ack(message);
        });
    }
}

function getTaskJobName(id: number): string {
    return `task_${id}`;
}
