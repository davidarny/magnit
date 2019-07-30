import { TemplateController } from "./template.controller";
import { Test } from "@nestjs/testing";
import { TemplateService } from "./template.service";

describe("TemplateController", () => {
    let templateController: TemplateController;
    const templateService = {
        async findAll() {
            return [];
        },
    };

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: TemplateService,
                    useValue: templateService,
                },
            ],
            controllers: [TemplateController],
        }).compile();

        templateController = app.get(TemplateController);
    });

    describe("root", () => {
        it("should return empty list of templates", async () => {
            const result = { success: 1, total: 0, templates: [] };
            expect(await templateController.findAll()).toStrictEqual(result);
        });
    });
});
