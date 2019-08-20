import { createMockFrom } from "../../../utils/create-mock.util";
import { TemplateController } from "../template.controller";
import { Test } from "@nestjs/testing";
import { TemplateService } from "../services/template.service";

const payload = require("./template.json");

describe("TemplateController", () => {
    let templateController: TemplateController;
    const templateService = createMockFrom(TemplateService.prototype);

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
        jest.spyOn(templateService, "findAll").mockResolvedValue([]);
        expect(await templateController.findAll()).toStrictEqual(result);
    });

    it("should create template", async () => {
        const result = { success: 1, template_id: 0 };
        jest.spyOn(templateService, "insert").mockResolvedValue(payload);
        expect(await templateController.create(payload)).toStrictEqual(result);
    });

    it("should delete template", async () => {
        const result = { success: 1 };
        expect(await templateController.deleteById("0")).toStrictEqual(result);
    });
});
