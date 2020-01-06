import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getFriendlyDate } from "../../utils/date";
import { AmqpModule } from "../amqp/amqp.module";
import { AmqpService } from "../amqp/services/amqp.service";
import { AirwatchAuthModule } from "../auth/airwatch.auth.module";
import { MarketplaceModule } from "../marketplace/marketplace.module";
import { IPushMessage } from "../push-token/interfaces/push-message.interface";
import { PushTokenModule } from "../push-token/push-token.module";
import { ScheduleModule } from "../schedule/schedule.module";
import { ScheduleService } from "../schedule/services/schedule.service";
import { TemplateModule } from "../template/template.module";
import { UploadModule } from "../upload/upload.module";
import { Comment } from "./entities/comment.entity";
import { StageHistory } from "./entities/stage-history.entity";
import { TaskDocument } from "./entities/task-document.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { TemplateAssignment } from "./entities/tempalte-assignment.entity";
import { TaskService, TTaskWithLastStageAndToken } from "./services/task.service";
import { TaskStageSubscriber } from "./subscribers/task-stage.subscriber";
import { TaskSubscriber } from "./subscribers/task.subscriber";
import { TaskController } from "./task.controller";

@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskSubscriber, TaskStageSubscriber],
    imports: [
        TypeOrmModule.forFeature([
            Task,
            TaskStage,
            StageHistory,
            TaskDocument,
            Comment,
            TemplateAssignment,
        ]),
        UploadModule,
        PushTokenModule,
        AmqpModule,
        TemplateModule,
        ScheduleModule,
        MarketplaceModule,
        AirwatchAuthModule,
    ],
    exports: [TaskService],
})
export class TaskModule {
    private static NOTIFICATION_CHECK_JOB = "notification_check";
    // every 5 minutes
    private static NOTIFICATION_CHECK_CRON = "*/5 * * * *";

    private readonly logger = new Logger(TaskModule.name);

    // local cache
    private readonly cache = new Map<string, [Buffer, number]>();

    constructor(
        private readonly scheduleService: ScheduleService,
        private readonly taskService: TaskService,
        private readonly amqpService: AmqpService,
    ) {
        scheduleService.createJob(
            TaskModule.NOTIFICATION_CHECK_JOB,
            TaskModule.NOTIFICATION_CHECK_CRON,
            this.notifyAboutExpiringTasks.bind(this),
        );
    }

    private async notifyAboutExpiringTasks(): Promise<boolean> {
        const tasks = await this.taskService.findExpiring();
        if (tasks.length) {
            await Promise.all(tasks.map(this.sendPushToTask.bind(this)).filter(Boolean));
        }
        return false;
    }

    private async sendPushToTask(task: TTaskWithLastStageAndToken) {
        if (!task.tokens.length) {
            this.logger.warn(`Cannot send push to "${task.title}" without tokens`);
            return;
        }
        if (!task.stage) {
            this.logger.warn(`Cannot send push to "${task.title}" without stage`);
            return;
        }
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.PUSH_NOTIFICATION);
        const date = getFriendlyDate(new Date(task.stage.deadline));
        await Promise.all(
            task.tokens.map(token => {
                const pushMessage: IPushMessage = {
                    token,
                    message: `Этап "${task.stage.title}" задания "${task.title}" заканчивается ${date}`,
                };
                const log = `task "${task.title}" for stage "${task.stage.title}" expiring at "${date}"`;
                // set expiration date to tomorrow
                const tomorrow = Date.now() + 1000 * 60 * 60 * 24;
                const key = `${task.id}::${token}`;
                if (!this.cache.has(key)) {
                    this.logger.debug(`Cache not found, sending push to ${log}`);
                    const content = Buffer.from(JSON.stringify(pushMessage));
                    this.cache.set(key, [content, tomorrow]);
                    return channel.sendToQueue(AmqpService.PUSH_NOTIFICATION, content);
                }
                const [buffer, expiration] = this.cache.get(key);
                const actual = Buffer.from(JSON.stringify({ ...pushMessage, ...task.stage }));
                // push content is different
                if (buffer.compare(actual) !== 0) {
                    this.logger.debug(`Found cache with different content, sending push to ${log}`);
                    const content = Buffer.from(JSON.stringify(pushMessage));
                    this.cache.set(key, [actual, tomorrow]);
                    return channel.sendToQueue(AmqpService.PUSH_NOTIFICATION, content);
                }
                // push expired
                if (expiration <= Date.now()) {
                    this.logger.debug(`Found expired cache for ${log}`);
                    this.cache.delete(key);
                } else {
                    this.logger.debug(`Found cache for ${log}`);
                }
            }),
        );
    }
}
