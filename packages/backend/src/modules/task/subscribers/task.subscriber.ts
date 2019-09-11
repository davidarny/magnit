import { Inject, Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, EntitySubscriberInterface, UpdateEvent } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { IAmqpService } from "../../amqp/interfaces/amqp.service.interface";
import { AmqpService } from "../../amqp/services/amqp.service";
import { IPushMessage } from "../../push-token/interfaces/push-message.interface";
import { IPushTokenService } from "../../push-token/interfaces/push-token.service.interface";
import { PushTokenService } from "../../push-token/services/push-token.service";
import { StageHistory } from "../entities/stage-history.entity";
import { ETaskStatus, Task } from "../entities/task.entity";
import { ITaskService } from "../interfaces/task.service.interface";
import { TaskService } from "../services/task.service";

@Injectable()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
    constructor(
        @InjectConnection() readonly connection: Connection,
        @Inject(TaskService) private readonly taskService: ITaskService,
        @Inject(AmqpService) private readonly amqpService: IAmqpService,
        @Inject(PushTokenService) private readonly pushTokenService: IPushTokenService,
    ) {
        connection.subscribers.push(this);
    }

    listenTo(): Function {
        return Task;
    }

    @Transactional()
    async beforeUpdate(event: UpdateEvent<Task>): Promise<void> {
        const currentTask = event.entity;
        const prevTask = await event.manager.findOne(Task, currentTask.id, {
            relations: ["stages"],
        });
        const prevStatus = prevTask.status;
        const nextStatus = currentTask.status;
        const description = this.taskService.getDescriptionByTransition(prevStatus, nextStatus);
        // find non-finished stage
        // it means it's active
        // usually there should be only one non-finished stage
        const prevStage = prevTask.stages.find(stage => !stage.finished);
        // handle task completion
        if (nextStatus === ETaskStatus.COMPLETED) {
            prevStage.finished = true;
            await event.manager.save(prevStage);
        }
        // send push notification when transition to IN_PROGRESS
        if (nextStatus === ETaskStatus.IN_PROGRESS) {
            await this.tryToSendPushNotification(currentTask);
        }
        // set all task assignments to non-editable
        if (nextStatus === ETaskStatus.ON_CHECK) {
            await this.taskService.setAllAssignmentsNonEditable(currentTask.id);
        }
        if (prevStage && description) {
            const history = new StageHistory({ stage: prevStage, description });
            await event.manager.save(history);
        }
    }

    private async tryToSendPushNotification(task: Task): Promise<void> {
        if (!task.id_assignee) {
            return;
        }
        const pushTokens = await this.pushTokenService.getTokensByUserId(task.id_assignee);
        if (pushTokens) {
            const channel = await this.amqpService.getAssertedChannelFor(
                AmqpService.PUSH_NOTIFICATION,
            );
            await Promise.all(
                pushTokens.map(async pushToken => {
                    const pushMessage: IPushMessage = {
                        token: pushToken.token,
                        message: {
                            body: `Задание "${task.title}" теперь имеет статут "В работе"`,
                        },
                    };
                    await channel.sendToQueue(
                        AmqpService.PUSH_NOTIFICATION,
                        Buffer.from(JSON.stringify(pushMessage)),
                    );
                }),
            );
        }
    }
}
