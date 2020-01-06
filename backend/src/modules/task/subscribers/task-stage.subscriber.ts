import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { Transactional } from "typeorm-transactional-cls-hooked";
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

    @Transactional()
    async afterInsert(event: InsertEvent<TaskStage>): Promise<void> {
        const stages = await event.manager.find(TaskStage, {
            where: { id_task: event.entity.id_task },
        });
        // set all non-finished stages as finished
        // usually it should be only one of the stages
        await this.finishPreviousStages(event.entity, stages, event);
        const nextHistory = new StageHistory({
            description: "Создание этапа",
            stage: event.entity,
        });
        await event.manager.save(nextHistory);
    }

    private async finishPreviousStages(
        current: TaskStage,
        stages: TaskStage[],
        event: InsertEvent<TaskStage>,
    ): Promise<void> {
        await Promise.all(
            stages
                .filter(stage => stage.id !== current.id)
                .map(stage => {
                    if (stage.finished) {
                        return;
                    }
                    return event.manager.update(TaskStage, stage.id, { finished: true });
                }),
        );
    }
}
