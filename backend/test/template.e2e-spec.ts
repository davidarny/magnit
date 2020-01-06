import { NestApplication } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import request from "supertest";
import {
    initializeTransactionalContext,
    patchTypeORMRepositoryWithBaseRepository,
} from "typeorm-transactional-cls-hooked";
import { AmqpService } from "../src/modules/amqp/services/amqp.service";
import { AirwatchAuthModule } from "../src/modules/auth/airwatch.auth.module";
import { AirwatchAuthService } from "../src/modules/auth/services/airwatch-auth.service";
import { PushToken } from "../src/modules/push-token/entities/push-token.entity";
import { PushTokenService } from "../src/modules/push-token/services/push-token.service";
import { TemplateAnswerLocation } from "../src/modules/template/entities/template-answer-location.entity";
import { TemplateAnswer } from "../src/modules/template/entities/template-answer.entity";
import { Template } from "../src/modules/template/entities/template.entity";
import { TemplateService } from "../src/modules/template/services/template.service";
import { TemplateModule } from "../src/modules/template/template.module";
import { createMockFrom, getMockRepository } from "../src/utils/create-mock.util";

const payload = require("../src/modules/template/test/template.json");

describe("TemplateController (e2e)", () => {
    let app: NestApplication;

    const templateService = createMockFrom(TemplateService.prototype);
    const amqpService = createMockFrom(AmqpService.prototype);
    const airwatchAuthService = createMockFrom(AirwatchAuthModule.prototype);
    const pushTokenService = createMockFrom(PushTokenService.prototype);

    initializeTransactionalContext();
    patchTypeORMRepositoryWithBaseRepository();

    beforeAll(() => {
        // disallow auth guard
        process.env.ALLOW_AUTH = "false";
    });

    afterAll(() => {
        // reset allowance
        process.env.ALLOW_AUTH = undefined;
    });

    beforeEach(async () => {
        const moduleFixture = await Test.createTestingModule({ imports: [TemplateModule] })
            .overrideProvider(getRepositoryToken(Template))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(TemplateAnswer))
            .useValue(getMockRepository())
            .overrideProvider(getRepositoryToken(TemplateAnswerLocation))
            .useValue(getMockRepository())
            .overrideProvider(TemplateService)
            .useValue(templateService)
            .overrideProvider(AmqpService)
            .useValue(amqpService)
            .overrideGuard(AirwatchAuthService)
            .useValue(airwatchAuthService)
            .overrideProvider(PushTokenService)
            .useValue(pushTokenService)
            .overrideProvider(getRepositoryToken(PushToken))
            .useValue(getMockRepository())
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => await app.close());

    it("should get empty template list", async () => {
        jest.spyOn(templateService, "findAll").mockResolvedValue([[], 0]);
        return request(app.getHttpServer())
            .get("/v1/templates")
            .expect(200)
            .expect({ success: 1, total: 0, templates: [], all: 0 });
    });

    it("should create template", async () => {
        jest.spyOn(templateService, "insert").mockResolvedValue(payload);
        return request(app.getHttpServer())
            .post("/v1/templates")
            .send({ template: payload })
            .expect(201)
            .expect({ success: 1, template_id: 0 });
    });

    it("should return 404 if template doesn't exist", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(undefined);
        return request(app.getHttpServer())
            .get("/v1/templates/1")
            .expect(404)
            .expect({
                error: "Not Found",
                errorCode: 0,
                message: "Template with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should delete template", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(payload);
        return request(app.getHttpServer())
            .delete("/v1/templates/0")
            .expect(200)
            .expect({ success: 1 });
    });

    it("should return 404 if trying to delete template that doesn't exist", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(undefined);
        return request(app.getHttpServer())
            .delete("/v1/templates/1")
            .expect(404)
            .expect({
                error: "Not Found",
                errorCode: 0,
                message: "Template with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should update template", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(payload);
        jest.spyOn(templateService, "update").mockResolvedValue(payload);
        return request(app.getHttpServer())
            .put("/v1/templates/0")
            .send({ template: payload })
            .expect(200)
            .expect({ success: 1, template_id: 0 });
    });

    it("should return 404 if trying to update template that doesn't exist", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(undefined);
        return request(app.getHttpServer())
            .put("/v1/templates/1")
            .send({ template: payload })
            .expect(404)
            .expect({
                error: "Not Found",
                errorCode: 0,
                message: "Template with id 1 was not found",
                statusCode: 404,
            });
    });
});
