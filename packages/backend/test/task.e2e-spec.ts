import { NestApplication } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import * as request from "supertest";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { AmqpService } from "../src/modules/amqp/services/amqp.service";
import { Marketplace } from "../src/modules/marketplace/entities/marketplace.entity";
import { PushToken } from "../src/modules/push-token/entities/push-token.entity";
import { PushTokenService } from "../src/modules/push-token/services/push-token.service";
import { ScheduleService } from "../src/modules/schedule/services/schedule.service";
import { TaskReportDto } from "../src/modules/task/dto/task-report.dto";
import { Comment } from "../src/modules/task/entities/comment.entity";
import { StageHistory } from "../src/modules/task/entities/stage-history.entity";
import { TaskDocument } from "../src/modules/task/entities/task-document.entity";
import { TaskStage } from "../src/modules/task/entities/task-stage.entity";
import { ETaskStatus, Task } from "../src/modules/task/entities/task.entity";
import { TemplateAssignment } from "../src/modules/task/entities/tempalte-assignment.entity";
import { TaskService } from "../src/modules/task/services/task.service";
import { TaskStageSubscriber } from "../src/modules/task/subscribers/task-stage.subscriber";
import { TaskSubscriber } from "../src/modules/task/subscribers/task.subscriber";
import { TaskModule } from "../src/modules/task/task.module";
import { TemplateAnswerLocation } from "../src/modules/template/entities/template-answer-location.entity";
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
    const amqpService = createMockFrom(AmqpService.prototype);
    const pushTokenService = createMockFrom(PushTokenService.prototype);
    const scheduleService = createMockFrom(ScheduleService.prototype);

    const task: Task = {
        id: 0,
        title: "title",
        description: "description",
        status: ETaskStatus.IN_PROGRESS,
        assignments: [],
        stages: [],
        answers: [],
        documents: [],
        marketplace: {
            id: 0,
            address: "",
            city: "",
            format: "",
            region: "",
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
        },
        id_marketplace: null,
        id_owner: null,
        id_assignee: null,
        notify_before: 3,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
    };

    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [TaskModule] })
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
            .overrideProvider(AmqpService)
            .useValue(amqpService)
            .overrideProvider(PushTokenService)
            .useValue(pushTokenService)
            .overrideProvider(getRepositoryToken(PushToken))
            .useValue(getMockRepository())
            .overrideProvider(ScheduleService)
            .useValue(scheduleService)
            .overrideProvider(getRepositoryToken(TemplateAnswerLocation))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(TemplateAssignment))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(TaskDocument))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(Comment))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(Marketplace))
            .useValue(getMockRepository())
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => await app.close());

    it("should return empty list of tasks", async () => {
        jest.spyOn(taskService, "findAll").mockResolvedValue([[], 0]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .expect({ success: 1, total: 0, tasks: [], all: 0 });
    });

    it("should create task", async () => {
        jest.spyOn(taskService, "insert").mockResolvedValue(task.id);
        return request(app.getHttpServer())
            .post("/v1/tasks")
            .send({ task })
            .expect(201)
            .expect({ success: 1, task_id: 0 });
    });

    it("should ensure task created", async () => {
        jest.spyOn(taskService, "findAll").mockResolvedValue([[task], 1]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .then(response => {
                const expected = { success: 1, total: 1, all: 1, tasks: [task] };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("should get task by id", async () => {
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        return request(app.getHttpServer())
            .get("/v1/tasks/0")
            .expect(200)
            .then(response => {
                const expected = { success: 1, task };
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
                errorCode: 1,
                message: "Task with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should update task", async () => {
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        return request(app.getHttpServer())
            .put("/v1/tasks/0")
            .send({ task: updated })
            .expect(200)
            .expect({ success: 1 });
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
                errorCode: 1,
                message: "Task with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should ensure returns list with updated task", async () => {
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "findAll").mockResolvedValue([[updated], 1]);
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .then(response => {
                const expected = { success: 1, total: 1, all: 1, tasks: [updated] };
                expect(response.body).toStrictEqual(expected);
            });
    });

    it("should ensure returns updated task", async () => {
        const updated = { ...task, name: "updated task" };
        jest.spyOn(taskService, "findById").mockResolvedValue(updated);
        return request(app.getHttpServer())
            .get("/v1/tasks/0")
            .expect(200)
            .then(response => {
                const expected = { success: 1, task: updated };
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
        jest.spyOn(taskService, "getReport").mockResolvedValue([task, report]);
        const response = await request(app.getHttpServer())
            .get("/v1/tasks/0/report")
            .expect(200);
        const expected = { success: 1, report };
        expect(taskService.getReport).toHaveBeenCalledWith(0);
        expect(response.body).toEqual(expected);
    });
});
