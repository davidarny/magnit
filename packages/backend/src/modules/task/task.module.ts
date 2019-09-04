import { Inject, Logger, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { diskStorage } from "multer";
import { extname } from "path";
import { getFriendlyDate } from "../../utils/date";
import { AmqpModule } from "../amqp/amqp.module";
import { IAmqpService } from "../amqp/interfaces/amqp.service.interface";
import { AmqpService } from "../amqp/services/amqp.service";
import { IPushMessage } from "../push-token/interfaces/push-message.interface";
import { PushTokenModule } from "../push-token/push-token.module";
import { IScheduleService } from "../schedule/interfaces/schedule.service.interface";
import { ScheduleModule } from "../schedule/schedule.module";
import { ScheduleService } from "../schedule/services/schedule.service";
import { TemplateModule } from "../template/template.module";
import { StageHistory } from "./entities/stage-history.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { ITaskService } from "./interfaces/task.service.interface";
import { TaskService } from "./services/task.service";
import { TaskStageSubscriber } from "./subscribers/task-stage.subscriber";
import { TaskSubscriber } from "./subscribers/task.subscriber";
import { TaskController } from "./task.controller";

const MAX_HASH_LENGTH = 28;

@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskSubscriber, TaskStageSubscriber],
    imports: [
        TypeOrmModule.forFeature([Task, TaskStage, StageHistory]),
        // TODO: delegate to separate module
        MulterModule.register({
            storage: diskStorage({
                destination: "./public",
                filename(
                    req: Express.Request,
                    file: Express.Multer.File,
                    callback: (error: Error | null, filename: string) => void,
                ): void {
                    callback(
                        null,
                        `${createHash("sha256")
                            .update(new Date().valueOf().toString() + Math.random().toString())
                            .digest("hex")
                            .toString()
                            .substring(0, MAX_HASH_LENGTH)}${extname(file.originalname)}`,
                    );
                },
            }),
        }),
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
    private static NOTIFICATION_CHECK_CRON = "0 6 * * *";

    constructor(
        @Inject(ScheduleService) private readonly scheduleService: IScheduleService,
        @Inject(TaskService) private readonly taskService: ITaskService,
        @Inject(AmqpService) private readonly amqpService: IAmqpService,
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
