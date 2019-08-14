import { AppModule } from "../src/app.module";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { TemplateService } from "../src/shared/services/template.service";
import { NestApplication } from "@nestjs/core";
import { PuzzleService } from "../src/shared/services/puzzle.service";
import { SectionService } from "../src/shared/services/section.service";
import { createMockFrom } from "../src/utils/create-mock.util";

const payload = require("../src/modules/template/test/template.json");

describe("TemplateController (e2e)", () => {
    let app: NestApplication;
    const templateService = createMockFrom(TemplateService.prototype);
    const puzzleService = createMockFrom(PuzzleService.prototype);
    const sectionService = createMockFrom(SectionService.prototype);

    beforeEach(async () => {
        const imports = [AppModule];
        const moduleFixture = await Test.createTestingModule({ imports })
            .overrideProvider(TemplateService)
            .useValue(templateService)
            .overrideProvider(PuzzleService)
            .useValue(puzzleService)
            .overrideProvider(SectionService)
            .useValue(sectionService)
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterEach(async () => await app.close());

    it("should get empty template list", async () => {
        jest.spyOn(templateService, "findAll").mockResolvedValue([]);
        return request(app.getHttpServer())
            .get("/v1/templates")
            .expect(200)
            .expect({ success: 1, total: 0, templates: [] });
    });

    it("should create template", async () => {
        jest.spyOn(templateService, "save").mockResolvedValue(payload);
        return request(app.getHttpServer())
            .post("/v1/templates")
            .send({ template: payload })
            .expect(201)
            .expect({ success: 1, template_id: 0 });
    });

    it.skip("should get created template", async () => {
        return request(app.getHttpServer())
            .get("/v1/templates/0")
            .expect(200)
            .then(res => {
                const body = res.body;
                body.template = JSON.parse(body.template);
                expect(body).toStrictEqual({ success: 1, template: payload });
            });
    });

    it("should return 404 if template doesn't exist", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(undefined);
        return request(app.getHttpServer())
            .get("/v1/templates/1")
            .expect(404)
            .expect({
                error: "Not Found",
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
                message: "Template with id 1 was not found",
                statusCode: 404,
            });
    });

    it("should update template", async () => {
        jest.spyOn(templateService, "findById").mockResolvedValue(payload);
        jest.spyOn(templateService, "save").mockResolvedValue(payload);
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
                message: "Template with id 1 was not found",
                statusCode: 404,
            });
    });
});
