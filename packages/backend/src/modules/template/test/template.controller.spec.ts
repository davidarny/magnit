import { TemplateController } from "../template.controller";
import { Test } from "@nestjs/testing";
import { TemplateService } from "../services/template.service";
import { SectionService } from "../services/section.service";
import { PuzzleService } from "../services/puzzle.service";
import { ConditionService } from "../services/condition.service";
import { ValidationService } from "../services/validation.service";
import { Template } from "../entities/template.entity";

const payload = require("./payload.json");

describe("TemplateController", () => {
    let templateController: TemplateController;
    const templateService = {
        async findAll() {
            return [];
        },

        async save(template: Template) {
            return template;
        },

        async findById(id: string) {
            const buffer = { ...payload };
            delete buffer.sections;
            return { ...buffer };
        },
    };

    const sectionService = {
        async findByTemplateId(id: number) {
            if (payload.id !== id) {
                return;
            }
            return payload.sections.map(section => {
                const buffer = { ...section };
                delete buffer.puzzles;
                return { ...buffer };
            });
        },
    };

    const puzzleService = {
        async findBySectionId(id: string) {
            return payload.sections.reduce((prev, curr) => {
                if (curr.id !== id) {
                    return prev;
                }
                return [...prev, ...curr.puzzles];
            }, []);
        },

        async findByParentId(id: string) {
            const puzzles = await this.findBySectionId(payload.sections[0].id);
            return puzzles.reduce((prev, curr) => {
                if (curr.id !== id) {
                    return prev;
                }
                return [...prev, ...(curr.puzzles || [])];
            }, []);
        },
    };

    const conditionService = {
        async findByPuzzleId(id: string) {
            const puzzles = [
                ...(await puzzleService.findBySectionId(payload.sections[0].id)),
                ...(await puzzleService.findByParentId(id)),
            ];
            return puzzles.reduce((prev, curr) => {
                if (curr.id !== id) {
                    return prev;
                }
                return [...prev, ...(curr.conditions || [])];
            }, []);
        },
    };

    const validationService = {
        async findByPuzzleId(id: string) {
            const puzzles = [
                ...(await puzzleService.findBySectionId(payload.sections[0].id)),
                ...(await puzzleService.findByParentId(id)),
            ];
            return puzzles.reduce((prev, curr) => {
                if (curr.id !== id) {
                    return prev;
                }
                return [...prev, ...(curr.validations || [])];
            }, []);
        },
    };

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
