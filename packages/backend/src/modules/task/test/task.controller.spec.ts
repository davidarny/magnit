import { Test } from "@nestjs/testing";
import { createMockFrom } from "../../../utils/create-mock.util";
import { AmqpService } from "../../amqp/services/amqp.service";
import { Template } from "../../template/entities/template.entity";
import { TemplateService } from "../../template/services/template.service";
import { TaskReportDto } from "../dto/task-report.dto";
import { ETaskStatus, Task } from "../entities/task.entity";
import { TaskService } from "../services/task.service";
import { TaskController } from "../task.controller";

describe("TaskController", () => {
    let taskController: TaskController;

    const taskService = createMockFrom(TaskService.prototype);
    const templateService = createMockFrom(TemplateService.prototype);
    const amqpService = createMockFrom(AmqpService.prototype);

    const task: Task = {
        id: 0,
        title: "task",
        description: "task",
        status: "in_progress" as ETaskStatus,
        assignments: [],
        stages: [],
        id_assignee: null,
        id_owner: null,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
    };

    const template: Template = {
        id: 0,
        sections: [],
        assignments: [],
        answers: [],
        title: "template",
        type: "complex",
        description: "template",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 0,
    };

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: TaskService,
                    useValue: taskService,
                },
                {
                    provide: TemplateService,
                    useValue: templateService,
                },
                {
                    provide: AmqpService,
                    useValue: amqpService,
                },
            ],
            controllers: [TaskController],
        }).compile();

        taskController = app.get(TaskController);
    });

    it("should return empty list of tasks", async () => {
        const expected = { success: 1, total: 0, tasks: [] };
        jest.spyOn(taskService, "findAll").mockResolvedValue([]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should create task", async () => {
        const expected = { success: 1, task_id: 0 };
        jest.spyOn(taskService, "insert").mockResolvedValue(task);
        expect(await taskController.create(task)).toStrictEqual(expected);
    });

    it("should get task by id", async () => {
        const expected = { success: 1, task: { ...task, templates: [] } };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        jest.spyOn(templateService, "findByTaskId").mockResolvedValue([]);
        expect(await taskController.findById("0")).toStrictEqual(expected);
    });

    it("should return list of task with created task", async () => {
        const expected = { success: 1, total: 1, tasks: [task] };
        jest.spyOn(taskService, "findAll").mockResolvedValue([task]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should add template to task", async () => {
        const expected = { success: 1 };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        expect(await taskController.setTemplateAssignments("0", [0])).toStrictEqual(expected);
    });

    it("should ensure task was added to tasks", async () => {
        const expected = { success: 1, task: { ...task, templates: [0] } };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        jest.spyOn(templateService, "findByTaskId").mockResolvedValue([template]);
        expect(await taskController.findById("0")).toStrictEqual(expected);
    });

    it("should update task", async () => {
        const expected = { success: 1, task_id: 0 };
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "update").mockResolvedValue(updated);
        expect(await taskController.update("0", updated)).toStrictEqual(expected);
    });

    it("should get tasks with updated task", async () => {
        const updated = { ...task, name: "updated task" };
        const expected = { success: 1, total: 1, tasks: [updated] };
        jest.spyOn(taskService, "findAll").mockResolvedValue([updated]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should delete task", async () => {
        const expected = { success: 1 };
        expect(await taskController.deleteById("0")).toStrictEqual(expected);
    });

    it("should get task report", async () => {
        const report = new TaskReportDto();
        jest.spyOn(taskService, "getReport").mockResolvedValue([task, report]);
        const actual = await taskController.getReport("0");
        expect(taskService.getReport).toHaveBeenCalledWith("0");
        const expected = { success: 1, report };
        expect(actual).toEqual(expected);
    });
});
