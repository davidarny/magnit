import { Controller, Get, Query } from "@nestjs/common";
import { ApiImplicitQuery, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { TaskService } from "./services/task.service";
import { GetTasksResponse } from "./responses/get-tasks.response";
import { TTaskStatus } from "./entities/task.entity";

@ApiUseTags("tasks")
@Controller("tasks")
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Get("/")
    @ApiImplicitQuery({ name: "offset", description: "Defaults to 0" })
    @ApiImplicitQuery({ name: "limit", description: "Defaults to 10" })
    @ApiImplicitQuery({ name: "sort", enum: ["ASC", "DESC"], description: "Defaults to ASC" })
    @ApiImplicitQuery({ name: "name", description: "Query Task by name" })
    @ApiOkResponse({ type: GetTasksResponse, description: "Get all Tasks" })
    async findAll(
        @Query() offset: number = 0,
        @Query() limit: number = 10,
        @Query() sort: "ASC" | "DESC" = "ASC",
        @Query() status?: TTaskStatus,
        @Query() name?: string
    ) {
        const tasks = await this.taskService.findAll(offset, limit, sort, status, name);
        return { success: 1, total: tasks.length, tasks };
    }
}
