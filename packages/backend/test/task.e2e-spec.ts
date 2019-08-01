import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { NestApplication } from "@nestjs/core";
import { TaskService } from "../src/modules/tasks/services/task.service";
import { taskService } from "../src/modules/tasks/test/mocks/task.service.mock";
import { TaskDto } from "../src/modules/tasks/dto/task.dto";

describe("TaskController (e2e)", () => {
    let app: NestApplication;
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
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => {
        await app.close();
    });

    it("GET /v1/tasks", async () => {
        return request(app.getHttpServer())
            .get("/v1/tasks")
            .expect(200)
            .expect({ success: 1, total: 0, tasks: await taskService.findAll() });
    });

    it("POST /v1/tasks", async () => {
        return request(app.getHttpServer())
            .post("/v1/tasks")
            .send({ task: payload })
            .expect(201)
            .expect({ success: 1, task_id: 0 });
    });
});
