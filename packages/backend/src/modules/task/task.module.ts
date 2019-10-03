import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getFriendlyDate } from "../../utils/date";
import { AmqpModule } from "../amqp/amqp.module";
import { AmqpService } from "../amqp/services/amqp.service";
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
    ],
    exports: [TaskService],
})
export class TaskModule {
    private static NOTIFICATION_CHECK_JOB = "notification_check";
    // every 15 minutes
    private static NOTIFICATION_CHECK_CRON = "*/15 * * * *";

    private readonly logger = new Logger(TaskModule.name);

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
        const tasks = await this.taskService.findTasksWithExpiringStages();
        if (tasks.length) {
            await Promise.all(tasks.map(this.sendPushToTask.bind(this)).filter(Boolean));
        }
        return false;
    }

    private async sendPushToTask(task: TTaskWithLastStageAndToken) {
        if (!task.tokens.length) {
            this.logger.warn(`Cannot send notification to "${task.title}" without tokens`);
            return;
        }
        if (!task.stage) {
            this.logger.warn(`Cannot send notification to "${task.title}" without stage`);
            return;
        }
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.PUSH_NOTIFICATION);
        const friendlyDate = getFriendlyDate(new Date(task.stage.deadline));
        await Promise.all(
            task.tokens.map(token => {
                const pushMessage: IPushMessage = {
                    token,
                    message: {
                        body: `Задание "${task.title}" заканчивается ${friendlyDate}`,
                    },
                };
                return channel.sendToQueue(
                    AmqpService.PUSH_NOTIFICATION,
                    Buffer.from(JSON.stringify(pushMessage)),
                );
            }),
        );
        this.logger.debug(
            `Sent push to "${task.title}" for stage "${task.stage.title}" expiring at "${task.stage.deadline}"`,
        );
    }
}
