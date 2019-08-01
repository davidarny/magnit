import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { NestApplication } from "@nestjs/core";
import { TaskService } from "../src/modules/tasks/services/task.service";
import { ConditionServiceMock } from "../src/shared/mocks/condition.service.mock";
import { PuzzleServiceMock } from "../src/shared/mocks/puzzle.service.mock";
import { SectionServiceMock } from "../src/shared/mocks/section.service.mock";
import { TaskServiceMock } from "../src/shared/mocks/task.service.mock";
import { TaskDto } from "../src/modules/tasks/dto/task.dto";
import { ValidationServiceMock } from "../src/shared/mocks/validation.service.mock";
import { ConditionService } from "../src/shared/services/condition.service";
import { PuzzleService } from "../src/shared/services/puzzle.service";
import { SectionService } from "../src/shared/services/section.service";
import { TemplateService } from "../src/shared/services/template.service";
import { TemplateServiceMock } from "../src/shared/mocks/template.service.mock";
import { ValidationService } from "../src/shared/services/validation.service";

describe("TaskController (e2e)", () => {
    let app: NestApplication;
    const taskService = new TaskServiceMock();
    const templateService = new TemplateServiceMock();
    const puzzleService = new PuzzleServiceMock();
    const sectionService = new SectionServiceMock();
    const conditionService = new ConditionServiceMock(puzzleService);
    const validationService = new ValidationServiceMock(puzzleService);
    const payload: TaskDto = {
        id: 0,
        name: "task",
        description: "task",
        status: "in_progress",
    };

    beforeEach(async () => {
        const imports = [AppModule];
        const moduleFixture = await Test.createTestingModule({ imports })
            .overrideProvider(TaskService)
            .useValue(taskService)
            .overrideProvider(TemplateService)
            .useValue(templateService)
            .overrideProvider(PuzzleService)
            .useValue(puzzleService)
            .overrideProvider(SectionService)
            .useValue(sectionService)
            .overrideProvider(ConditionService)
            .useValue(conditionService)
            .overrideProvider(ValidationService)
            .useValue(validationService)
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => {
        await app.close();
    });

    it("GET /v1/tasks should return empty list of tasks", async () => {
        jest.spyOn(taskService, "findAll").mockImplementation(async () => []);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .expect({ success: 1, total: 0, tasks: [] });
    });

    it("POST /v1/tasks should create task", async () => {
        jest.spyOn(taskService, "save").mockImplementation(async () => ({ id: 0 }));
        return request(app.getHttpServer())
            .post("/v1/tasks")
            .send({ task: payload })
            .expect(201)
            .expect({ success: 1, task_id: 0 });
    });

    it("GET /v1/tasks should ensure task created", async () => {
        jest.spyOn(taskService, "findAll").mockImplementation(async () => [payload]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .then(response => {
                const expected = { success: 1, total: 1, tasks: [payload] };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("GET /v1/tasks/0 should get task by id", async () => {
        jest.spyOn(taskService, "findById").mockImplementation(async () => payload);
        jest.spyOn(templateService, "findByTaskId").mockImplementation(async () => []);
        return request(app.getHttpServer())
            .get("/v1/tasks/0")
            .expect(200)
            .then(response => {
                const expected = { success: 1, task: { ...payload, templates: [] } };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("GET /v1/tasks/1 should ensure throws if task not exists", async () => {
        jest.spyOn(taskService, "findById").mockImplementation(async () => undefined);
        return request(app.getHttpServer())
            .get("/v1/tasks/1")
            .expect(404)
            .expect({
                error: "Not Found",
                message: "Task with id 1 was not found",
                statusCode: 404,
            });
    });

    it("PUT /v1/tasks/0 should update task", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        jest.spyOn(taskService, "findById").mockImplementation(async () => payload);
        jest.spyOn(taskService, "save").mockImplementation(async () => ({ id: 0 }));
        return request(app.getHttpServer())
            .put("/v1/tasks/0")
            .send({ task: updatedPayload })
            .expect(200)
            .expect({ success: 1, task_id: 0 });
    });

    it("PUT /v1/tasks/1 should ensure throws if task not exists", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        jest.spyOn(taskService, "findById").mockImplementation(async () => undefined);
        return request(app.getHttpServer())
            .put("/v1/tasks/1")
            .send({ task: updatedPayload })
            .expect(404)
            .expect({
                error: "Not Found",
                message: "Task with id 1 was not found",
                statusCode: 404,
            });
    });

    it("GET /v1/tasks should ensure returns list with updated task", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        jest.spyOn(taskService, "findAll").mockImplementation(async () => [updatedPayload]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .then(response => {
                const expected = { success: 1, total: 1, tasks: [updatedPayload] };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("GET /v1/tasks/0 should ensure returns updated task", async () => {
        const updatedPayload = { ...payload, name: "updated task" };
        jest.spyOn(taskService, "findById").mockImplementation(async () => updatedPayload);
        jest.spyOn(templateService, "findByTaskId").mockImplementation(async () => []);
        return request(app.getHttpServer())
            .get("/v1/tasks/0")
            .expect(200)
            .then(response => {
                const expected = { success: 1, task: { ...updatedPayload, templates: [] } };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("DELETE /v1/tasks/0 should delete task", async () => {
        return request(app.getHttpServer())
            .delete("/v1/tasks/0")
            .expect(200)
            .expect({ success: 1 });
    });
});
