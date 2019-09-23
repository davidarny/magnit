import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { createMockFrom } from "../../utils/create-mock.util";
import { UserService } from "./services/user.service";
import { User } from "./entities/user.entity";

describe("Auth Controller", () => {
    let controller: AuthController;
    const userService = createMockFrom(UserService.prototype);

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: UserService,
                    useValue: userService,
                },
            ],
            controllers: [AuthController],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
