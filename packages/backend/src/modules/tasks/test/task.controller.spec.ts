import { TaskController } from "../task.controller";
import { TaskService } from "../services/task.service";
import { taskService } from "./mocks/task.service.mock";
import { Test } from "@nestjs/testing";
import { TaskDto } from "../dto/task.dto";

describe("TaskController", () => {
    let taskController: TaskController;

    beforeEach(async () => {
        const providers = [
            {
                provide: TaskService,
                useValue: taskService,
            },
        ];
        const controllers = [TaskController];
        const app = await Test.createTestingModule({ providers, controllers }).compile();

        taskController = app.get(TaskController);
    });

    it("should return empty list of tasks", async () => {
        const result = { success: 1, total: 0, tasks: [] };
        expect(await taskController.findAll()).toStrictEqual(result);
    });

    it("should create task", async () => {
        const result = { success: 1, task_id: 0 };
        const payload: TaskDto = {
            id: 0,
            name: "task",
            description: "task",
            status: "in_progress",
        };
        expect(await taskController.create(payload)).toStrictEqual(result);
    });
});
