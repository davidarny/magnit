import { TaskController } from "../task.controller";
import { TaskService } from "../services/task.service";
import { taskService } from "./mocks/task.service.mock";
import { Test } from "@nestjs/testing";
import { TaskDto } from "../dto/task.dto";
import { Task } from "../entities/task.entity";

describe("TaskController", () => {
    let taskController: TaskController;
    const payload: TaskDto = {
        id: 0,
        name: "task",
        description: "task",
        status: "in_progress",
    };

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
        const expected = { success: 1, total: 0, tasks: [] };
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should create task", async () => {
        const expected = { success: 1, task_id: 0 };
        expect(await taskController.create(payload)).toStrictEqual(expected);
    });

    it("should return list of task with created task", async () => {
        const expected = { success: 1, total: 1, tasks: [new Task(payload)] };
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should update template", async () => {
        const expected = { success: 1, task_id: 0 };
        const updatedPayload = { ...payload, name: "updated task" };
        expect(await taskController.update("0", updatedPayload)).toStrictEqual(expected);
    });

    it("should get templates with updated task", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        const expected = { success: 1, total: 1, tasks: [updatedPayload] };
        expect(await taskController.findAll()).toStrictEqual(expected);
    });
});
