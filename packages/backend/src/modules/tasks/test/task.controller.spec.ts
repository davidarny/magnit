import { ConditionServiceMock } from "../../../shared/mocks/condition.service.mock";
import { PuzzleServiceMock } from "../../../shared/mocks/puzzle.service.mock";
import { SectionServiceMock } from "../../../shared/mocks/section.service.mock";
import { ValidationServiceMock } from "../../../shared/mocks/validation.service.mock";
import { ConditionService } from "../../../shared/services/condition.service";
import { PuzzleService } from "../../../shared/services/puzzle.service";
import { SectionService } from "../../../shared/services/section.service";
import { ValidationService } from "../../../shared/services/validation.service";
import { TaskController } from "../task.controller";
import { TaskService } from "../services/task.service";
import { TaskServiceMock } from "../../../shared/mocks/task.service.mock";
import { Test } from "@nestjs/testing";
import { TaskDto } from "../dto/task.dto";
import { TemplateService } from "../../../shared/services/template.service";
import { TemplateServiceMock } from "../../../shared/mocks/template.service.mock";

describe("TaskController", () => {
    let taskController: TaskController;
    const taskService = new TaskServiceMock();
    const templateService = new TemplateServiceMock();
    const sectionService = new SectionServiceMock();
    const puzzleService = new PuzzleServiceMock();
    const conditionService = new ConditionServiceMock(puzzleService);
    const validationService = new ValidationServiceMock(puzzleService);
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
            {
                provide: TemplateService,
                useValue: templateService,
            },
            {
                provide: SectionService,
                useValue: sectionService,
            },
            {
                provide: PuzzleService,
                useValue: puzzleService,
            },
            {
                provide: ConditionService,
                useValue: conditionService,
            },
            {
                provide: ValidationService,
                useValue: validationService,
            },
        ];
        const controllers = [TaskController];
        const app = await Test.createTestingModule({ providers, controllers }).compile();

        taskController = app.get(TaskController);
    });

    it("should return empty list of tasks", async () => {
        const expected = { success: 1, total: 0, tasks: [] };
        jest.spyOn(taskService, "findAll").mockImplementation(async () => []);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should create task", async () => {
        const expected = { success: 1, task_id: 0 };
        jest.spyOn(taskService, "save").mockImplementation(async () => ({ id: 0 }));
        expect(await taskController.create(payload)).toStrictEqual(expected);
    });

    it("should get task by id", async () => {
        const expected = { success: 1, task: { ...payload, templates: [] } };
        jest.spyOn(taskService, "findById").mockImplementation(async () => payload);
        expect(await taskController.findById("0")).toStrictEqual(expected);
    });

    it("should return list of task with created task", async () => {
        const expected = { success: 1, total: 1, tasks: [payload] };
        jest.spyOn(taskService, "findAll").mockImplementation(async () => [payload]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should add template to task", async () => {
        const expected = { success: 1 };
        jest.spyOn(taskService, "findById").mockImplementation(async () => ({ id: 0 }));
        expect(await taskController.addTemplates("0", [0])).toStrictEqual(expected);
    });

    it("should ensure task was added to tasks", async () => {
        const expected = { success: 1, task: { ...payload, templates: [0] } };
        jest.spyOn(taskService, "findById").mockImplementation(async () => payload);
        jest.spyOn(templateService, "findByTaskId").mockImplementation(async () => [{ id: 0 }]);
        expect(await taskController.findById("0")).toStrictEqual(expected);
    });

    it("should update task", async () => {
        const expected = { success: 1, task_id: 0 };
        const updatedPayload = { ...payload, name: "updated task" };
        jest.spyOn(taskService, "save").mockImplementation(async () => updatedPayload);
        expect(await taskController.update("0", updatedPayload)).toStrictEqual(expected);
    });

    it("should get tasks with updated task", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        const expected = { success: 1, total: 1, tasks: [updatedPayload] };
        jest.spyOn(taskService, "findAll").mockImplementation(async () => [updatedPayload]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should delete task", async () => {
        const expected = { success: 1 };
        expect(await taskController.deleteById("0")).toStrictEqual(expected);
    });
});
