import { AppModule } from "../src/app.module";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { TemplateService } from "../src/modules/template/template.service";
import { NestApplication } from "@nestjs/core";

describe("TemplateController (e2e)", () => {
    let app: NestApplication;
    const templateService = {
        async findAll() {
            return [];
        },
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(TemplateService)
            .useValue(templateService)
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("GET v1/templates", () => {
        return request(app.getHttpServer())
            .get("/v1/templates")
            .expect(200)
            .expect({ success: 1, total: 0, templates: templateService.findAll() });
    });
});
