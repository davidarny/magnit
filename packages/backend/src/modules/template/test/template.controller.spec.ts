import { Test } from "@nestjs/testing";
import { createMockFrom } from "../../../utils/create-mock.util";
import { AirwatchAuthModule } from "../../auth/airwatch.auth.module";
import { JwtTokenManager } from "../../auth/providers/jwt.token.manager";
import { AirwatchAuthService } from "../../auth/services/airwatch-auth.service";
import { PushTokenService } from "../../push-token/services/push-token.service";
import { TemplateService } from "../services/template.service";
import { TemplateController } from "../template.controller";

const payload = require("./template.json");

describe("TemplateController", () => {
    let templateController: TemplateController;

    const templateService = createMockFrom(TemplateService.prototype);
    const airwatchAuthService = createMockFrom(AirwatchAuthModule.prototype);
    const jwtTokenManager = createMockFrom(JwtTokenManager.prototype);
    const pushTokenService = createMockFrom(PushTokenService.prototype);

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: TemplateService,
                    useValue: templateService,
                },
                {
                    provide: AirwatchAuthService,
                    useValue: airwatchAuthService,
                },
                {
                    provide: JwtTokenManager,
                    useValue: jwtTokenManager,
                },
                {
                    provide: PushTokenService,
                    useValue: pushTokenService,
                },
            ],
            controllers: [TemplateController],
        }).compile();

        templateController = app.get(TemplateController);
    });

    it("should return empty list of templates", async () => {
        const result = { success: 1, total: 0, templates: [], all: 0 };
        jest.spyOn(templateService, "findAll").mockResolvedValue([[], 0]);
        expect(await templateController.findAll()).toStrictEqual(result);
    });

    it("should create template", async () => {
        const result = { success: 1, template_id: 0 };
        jest.spyOn(templateService, "insert").mockResolvedValue(payload);
        expect(await templateController.create(payload)).toStrictEqual(result);
    });

    it("should delete template", async () => {
        const result = { success: 1 };
        expect(await templateController.deleteById(0)).toStrictEqual(result);
    });
});
