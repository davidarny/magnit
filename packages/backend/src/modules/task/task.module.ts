import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getFriendlyDate } from "../../utils/date";
import { AmqpModule } from "../amqp/amqp.module";
import { AmqpService } from "../amqp/services/amqp.service";
import { IPushMessage } from "../push-token/interfaces/push-message.interface";
import { PushTokenModule } from "../push-token/push-token.module";
import { ScheduleModule } from "../schedule/schedule.module";
import { ScheduleService } from "../schedule/services/schedule.service";
import { TemplateModule } from "../template/template.module";
import { UploadModule } from "../upload/upload.module";
import { StageHistory } from "./entities/stage-history.entity";
import { TaskDocument } from "./entities/task-document.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { TemplateAssignment } from "./entities/tempalte-assignment.entity";
import { TaskService } from "./services/task.service";
import { TaskStageSubscriber } from "./subscribers/task-stage.subscriber";
import { TaskSubscriber } from "./subscribers/task.subscriber";
import { TaskController } from "./task.controller";

@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskSubscriber, TaskStageSubscriber],
    imports: [
        TypeOrmModule.forFeature([Task, TaskStage, StageHistory, TemplateAssignment, TaskDocument]),
        UploadModule,
        PushTokenModule,
        AmqpModule,
        TemplateModule,
        ScheduleModule,
    ],
    exports: [TaskService],
})
export class TaskModule {
    private readonly logger = new Logger(TaskModule.name);

    private static NOTIFICATION_CHECK_JOB = "notification_check";
    // every day at 6:00
    private static NOTIFICATION_CHECK_CRON = "0 6 * * *";

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
        if (tasks && Array.isArray(tasks)) {
            await Promise.all(
                tasks
                    .map(async task => {
                        if (!task.token) {
                            this.logger.warn(
                                `Cannot send notification to "${task.title}" without token`,
                            );
                            return;
                        }
                        if (!task.stage) {
                            this.logger.warn(
                                `Cannot send notification to "${task.title}" without stage`,
                            );
                            return;
                        }
                        const channel = await this.amqpService.getAssertedChannelFor(
                            AmqpService.PUSH_NOTIFICATION,
                        );
                        const friendlyDate = getFriendlyDate(new Date(task.stage.deadline));
                        const pushMessage: IPushMessage = {
                            token: task.token,
                            message: {
                                body: `Задание "${task.title}" заканчивается ${friendlyDate}`,
                            },
                        };
                        await channel.sendToQueue(
                            AmqpService.PUSH_NOTIFICATION,
                            Buffer.from(JSON.stringify(pushMessage)),
                        );
                    })
                    .filter(Boolean),
            );
        }
        this.logger.debug(tasks);
        return true;
    }
}
