import { ArgumentMetadata, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { TaskNotFoundException } from "../../../shared/exceptions/task-not-found.exception";
import { TaskService } from "../services/task.service";

@Injectable()
export class TaskByIdPipe implements PipeTransform<string, Promise<string>> {
    constructor(@Inject(TaskService) private readonly taskService: TaskService) {}

    async transform(id: string, metadata: ArgumentMetadata): Promise<string> {
        if (!(await this.taskService.findById(id))) {
            throw new TaskNotFoundException(`Task with id ${id} was not found`);
        }
        return id;
    }
}
