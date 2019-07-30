import { TemplateController } from "../template.controller";
import { Test } from "@nestjs/testing";
import { TemplateService } from "../services/template.service";
import { SectionService } from "../services/section.service";
import { PuzzleService } from "../services/puzzle.service";
import { ConditionService } from "../services/condition.service";
import { ValidationService } from "../services/validation.service";
import { sectionService } from "./mocks/section.service.mock";
import { puzzleService } from "./mocks/puzzle.service.mock";
import { conditionService } from "./mocks/condition.service.mock";
import { validationService } from "./mocks/validation.service.mock";
import { templateService } from "./mocks/template.service.mock";

const payload = require("./payload.json");

describe("TemplateController", () => {
    let templateController: TemplateController;

    beforeEach(async () => {
        const providers = [
            {
                provide: TemplateService,
                useValue: templateService,
            },
            {
                provide: SectionService,
                useValue: sectionService,
            },
            {
                provide: PuzzleService,
                useValue: puzzleService,
            },
            {
                provide: ConditionService,
                useValue: conditionService,
            },
            {
                provide: ValidationService,
                useValue: validationService,
            },
        ];
        const controllers = [TemplateController];
        const app = await Test.createTestingModule({ providers, controllers }).compile();

        templateController = app.get(TemplateController);
    });

    it("should return empty list of templates", async () => {
        const result = { success: 1, total: 0, templates: [] };
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
});
