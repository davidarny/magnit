/* tslint:disable:no-shadowed-variable */

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { ETaskStatus, Task } from "../entities/task.entity";
import { TaskService } from "../services/task.service";

@Injectable()
export class TaskExpiredPipe implements PipeTransform<number | unknown, Promise<number | unknown>> {
    constructor(private readonly taskService: TaskService) {}

    async transform(id: number | unknown, metadata: ArgumentMetadata): Promise<number | unknown> {
        if (typeof id !== "number") {
            const tasks = await this.taskService.findAll();
            await Promise.all(tasks.map(async task => this.setTaskExpired(task)));
        } else {
            const task = await this.taskService.findById(id);
            await this.setTaskExpired(task);
        }
        return id;
    }

    private async setTaskExpired(task: Task): Promise<void> {
        if (task.status === ETaskStatus.EXPIRED) {
            return;
        }
        const activeStage = await this.taskService.findActiveStage(task.id);
        if (activeStage && new Date(activeStage.deadline).valueOf() <= Date.now()) {
            await this.taskService.update(task.id, { status: ETaskStatus.EXPIRED });
        }
    }
}
