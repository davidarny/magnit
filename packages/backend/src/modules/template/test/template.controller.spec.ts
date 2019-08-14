import { createMockFrom } from "../../../utils/create-mock.util";
import { TemplateController } from "../template.controller";
import { Test } from "@nestjs/testing";
import { TemplateService } from "../../../shared/services/template.service";
import { SectionService } from "../../../shared/services/section.service";
import { PuzzleService } from "../../../shared/services/puzzle.service";
import { PuzzleAssemblerService } from "../../../shared/services/puzzle-assembler.service";

const payload = require("./template.json");

describe("TemplateController", () => {
    let templateController: TemplateController;
    const templateService = createMockFrom(TemplateService.prototype);
    const sectionService = createMockFrom(SectionService.prototype);
    const puzzleService = createMockFrom(PuzzleService.prototype);

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
            PuzzleAssemblerService,
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
        jest.spyOn(templateService, "save").mockResolvedValue(payload);
        expect(await templateController.create(payload)).toStrictEqual(result);
    });

    it.skip("should return assembled template", async () => {
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
