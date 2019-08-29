import { Inject, Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, EntitySubscriberInterface, UpdateEvent } from "typeorm";
import { StageHistory } from "../entities/stage-history.entity";
import { ETaskStatus, Task } from "../entities/task.entity";
import { ITaskService } from "../interfaces/task.service.interface";
import { TaskService } from "../services/task.service";

@Injectable()
export class TaskSubscriber implements EntitySubscriberInterface<Task> {
    constructor(
        @InjectConnection() readonly connection: Connection,
        @Inject(TaskService) private readonly taskService: ITaskService,
    ) {
        connection.subscribers.push(this);
    }

    listenTo(): Function {
        return Task;
    }

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
        if (prevStage && description) {
            const history = new StageHistory({ stage: prevStage, description });
            await event.manager.save(history);
        }
    }
}
