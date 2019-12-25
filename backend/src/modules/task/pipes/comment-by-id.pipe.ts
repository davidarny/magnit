import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { TaskNotFoundException } from "../../../shared/exceptions/task-not-found.exception";
import { TaskService } from "../services/task.service";

@Injectable()
export class CommentByIdPipe implements PipeTransform<number, Promise<number>> {
    constructor(private readonly taskService: TaskService) {}

    async transform(id: number, metadata: ArgumentMetadata): Promise<number> {
        const exists = this.taskService.commentExists(id);
        if (!exists) {
            throw new TaskNotFoundException(`Comment with id ${id} was not found`);
        }
        return id;
    }
}
