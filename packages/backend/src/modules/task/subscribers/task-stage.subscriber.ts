import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { StageHistory } from "../entities/stage-history.entity";
import { TaskStage } from "../entities/task-stage.entity";

@Injectable()
export class TaskStageSubscriber implements EntitySubscriberInterface<TaskStage> {
    constructor(@InjectConnection() readonly connection: Connection) {
        connection.subscribers.push(this);
    }

    listenTo(): Function {
        return TaskStage;
    }

    async afterInsert(event: InsertEvent<TaskStage>): Promise<void> {
        const history = new StageHistory({
            description: "Создание этапа",
            date: new Date().toISOString(),
            stage: event.entity,
        });
        await event.manager.save(history);
    }
}
