import {
    ArgumentMetadata,
    Inject,
    Injectable,
    NotFoundException,
    PipeTransform,
} from "@nestjs/common";
import { TaskService } from "../services/task.service";

@Injectable()
export class TaskByIdPipe implements PipeTransform<string, Promise<string>> {
    constructor(@Inject(TaskService) private readonly taskService: TaskService) {}

    async transform(id: string, metadata: ArgumentMetadata): Promise<string> {
        if (!(await this.taskService.findById(id))) {
            throw new NotFoundException(`Task with id ${id} was not found`);
        }
        return id;
    }
}
