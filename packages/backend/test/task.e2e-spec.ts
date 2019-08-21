import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { NestApplication } from "@nestjs/core";
import { Task } from "../src/modules/task/entities/task.entity";
import { TaskService } from "../src/modules/task/services/task.service";
import { TemplateService } from "../src/modules/template/services/template.service";
import { createMockFrom } from "../src/utils/create-mock.util";

describe("TaskController (e2e)", () => {
    let app: NestApplication;
    const taskService = createMockFrom(TaskService.prototype);
    const templateService = createMockFrom(TemplateService.prototype);
    const task: Task = {
        id: 0,
        title: "task",
        description: "task",
        status: "in_progress",
        template_assignments: [],
        updated_at: Date.now(),
        created_at: Date.now(),
    };

    beforeEach(async () => {
        const imports = [AppModule];
        const moduleFixture = await Test.createTestingModule({ imports })
            .overrideProvider(TaskService)
            .useValue(taskService)
            .overrideProvider(TemplateService)
            .useValue(templateService)
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => {
        await app.close();
    });

    it("should return empty list of tasks", async () => {
        jest.spyOn(taskService, "findAll").mockResolvedValue([]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .expect({ success: 1, total: 0, tasks: [] });
    });

    it("should create task", async () => {
        jest.spyOn(taskService, "insert").mockResolvedValue(task);
        return request(app.getHttpServer())
            .post("/v1/tasks")
            .send({ task })
            .expect(201)
            .expect({ success: 1, task_id: 0 });
    });

    it("should ensure task created", async () => {
        jest.spyOn(taskService, "findAll").mockResolvedValue([task]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .then(response => {
                const expected = { success: 1, total: 1, tasks: [task] };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("should get task by id", async () => {
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        jest.spyOn(templateService, "findByTaskId").mockResolvedValue([]);
        return request(app.getHttpServer())
            .get("/v1/tasks/0")
            .expect(200)
            .then(response => {
                const expected = { success: 1, task: { ...task, templates: [] } };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("should ensure throws if task not exists", async () => {
        jest.spyOn(taskService, "findById").mockResolvedValue(undefined);
        return request(app.getHttpServer())
            .get("/v1/tasks/1")
            .expect(404)
            .expect({
                error: "Not Found",
                message: "Task with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should update task", async () => {
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        jest.spyOn(taskService, "update").mockResolvedValue(updated);
        return request(app.getHttpServer())
            .put("/v1/tasks/0")
            .send({ task: updated })
            .expect(200)
            .expect({ success: 1, task_id: 0 });
    });

    it("should ensure throws if task not exists", async () => {
        jest.spyOn(taskService, "findById").mockResolvedValue(undefined);
        const updated = { ...task, name: "updated task" };
        return request(app.getHttpServer())
            .put("/v1/tasks/1")
            .send({ task: updated })
            .expect(404)
            .expect({
                error: "Not Found",
                message: "Task with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should ensure returns list with updated task", async () => {
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "findAll").mockResolvedValue([updated]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .then(response => {
                const expected = { success: 1, total: 1, tasks: [updated] };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("should ensure returns updated task", async () => {
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "findById").mockResolvedValue(updated);
        jest.spyOn(templateService, "findByTaskId").mockResolvedValue([]);
        return request(app.getHttpServer())
            .get("/v1/tasks/0")
            .expect(200)
            .then(response => {
                const expected = { success: 1, task: { ...updated, templates: [] } };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("should delete task", async () => {
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        return request(app.getHttpServer())
            .delete("/v1/tasks/0")
            .expect(200)
            .expect({ success: 1 });
    });
});
