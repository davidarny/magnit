import { ArgumentMetadata, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { TaskNotFoundException } from "../../../shared/exceptions/task-not-found.exception";
import { TaskService } from "../services/task.service";

@Injectable()
export class DocumentByIdPipe implements PipeTransform<number, Promise<number>> {
    constructor(@Inject(TaskService) private readonly taskService: TaskService) {}

    async transform(id: number, metadata: ArgumentMetadata): Promise<number> {
        const exists = await this.taskService.documentByIdExists(id);
        if (!exists) {
            throw new TaskNotFoundException(`Document with id ${id} was not found`);
        }
        return id;
    }
}
