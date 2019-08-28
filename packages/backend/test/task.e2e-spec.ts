import { NestApplication } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { TaskReportDto } from "../src/modules/task/dto/task-report.dto";
import { StageHistory } from "../src/modules/task/entities/stage-history.entity";
import { TaskStage } from "../src/modules/task/entities/task-stage.entity";
import { ETaskStatus, Task } from "../src/modules/task/entities/task.entity";
import { TaskService } from "../src/modules/task/services/task.service";
import { TaskStageSubscriber } from "../src/modules/task/subscribers/task-stage.subscriber";
import { TaskSubscriber } from "../src/modules/task/subscribers/task.subscriber";
import { TaskModule } from "../src/modules/task/task.module";
import { TemplateAnswer } from "../src/modules/template/entities/template-answer.entity";
import { Template } from "../src/modules/template/entities/template.entity";
import { TemplateService } from "../src/modules/template/services/template.service";
import { createMockFrom, getMockRepository } from "../src/utils/create-mock.util";

describe("TaskController (e2e)", () => {
    let app: NestApplication;
    const taskService = createMockFrom(TaskService.prototype);
    const templateService = createMockFrom(TemplateService.prototype);
    const taskSubscriber = createMockFrom(TaskSubscriber.prototype);
    const taskStageSubscriber = createMockFrom(TaskStageSubscriber.prototype);
    const task: Task = {
        id: 0,
        title: "task",
        description: "task",
        status: "in_progress" as ETaskStatus,
        assignments: [],
        stages: [],
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
    };

    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();

    beforeEach(async () => {
        const metadata = { imports: [TaskModule] };
        const moduleFixture = await Test.createTestingModule(metadata)
            .overrideProvider(getRepositoryToken(Task))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(Template))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(TaskStage))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(StageHistory))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(TemplateAnswer))
            .useValue(getMockRepository())
            .overrideProvider(TaskSubscriber)
            .useValue(taskSubscriber)
            .overrideProvider(TaskStageSubscriber)
            .useValue(taskStageSubscriber)
            .overrideProvider(TaskService)
            .useValue(taskService)
            .overrideProvider(TemplateService)
            .useValue(templateService)
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => await app.close());

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

    it("should return report", async () => {
        const report = new TaskReportDto();
        jest.spyOn(taskService, "getReport").mockResolvedValue(report);
        const response = await request(app.getHttpServer())
            .get("/v1/tasks/0/report")
            .expect(200);
        const expected = { success: 1, report };
        expect(taskService.getReport).toHaveBeenCalledWith("0");
        expect(response.body).toEqual(expected);
    });
});
