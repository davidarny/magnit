import { TemplateController } from "../template.controller";
import { Test } from "@nestjs/testing";
import { TemplateService } from "../../../shared/services/template.service";
import { TemplateServiceMock } from "../../../shared/mocks/template.service.mock";

const payload = require("./template.json");

describe("TemplateController", () => {
    let templateController: TemplateController;
    const templateService = new TemplateServiceMock();

    beforeEach(async () => {
        const providers = [
            {
                provide: TemplateService,
                useValue: templateService,
            },
        ];
        const controllers = [TemplateController];
        const app = await Test.createTestingModule({ providers, controllers }).compile();

        templateController = app.get(TemplateController);
    });

    it("should return empty list of templates", async () => {
        const result = { success: 1, total: 0, templates: [] };
        jest.spyOn(templateService, "findAll").mockImplementation(async () => []);
        expect(await templateController.findAll()).toStrictEqual(result);
    });

    it("should create template", async () => {
        const result = { success: 1, template_id: 0 };
        expect(await templateController.create(payload)).toStrictEqual(result);
    });

    it("should return assembled template", async () => {
        const result = { success: 1, template: payload };
        const actual = await templateController.findById("0");
        actual.template = JSON.parse(actual.template);
        expect(actual).toStrictEqual(result);
    });

    it("should delete template", async () => {
        const result = { success: 1 };
        expect(await templateController.deleteById("0")).toStrictEqual(result);
    });
});
