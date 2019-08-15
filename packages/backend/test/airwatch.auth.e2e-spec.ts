import { Controller, Get } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { AirwatchAuthModule } from "../src/modules/auth/airwatch.auth.module";
import { User } from "../src/modules/auth/entities/user.entity";
import { AirwatchAuthService } from "../src/modules/auth/services/airwatch-auth.service";
import { AirwatchUserService } from "../src/modules/auth/services/airwatch-user.service";
import { createMockFrom } from "../src/utils/create-mock.util";

@Controller("mock")
class ControllerMock {
    @Get("/")
    get() {}
}

describe("Airwatch Auth", () => {
    let app: NestApplication;
    const airwatchUserService = createMockFrom(AirwatchUserService.prototype);
    const airwatchAuthService = createMockFrom(AirwatchAuthService.prototype);

    beforeAll(() => {
        // allow auth middleware
        process.env.ALLOW_AUTH = "true";
        process.env.AUTH_SECRET = "<test-32-characters-auth-secret>";
    });

    afterAll(() => {
        // reset allowance
        process.env.ALLOW_AUTH = undefined;
        process.env.AUTH_SECRET = undefined;
    });

    beforeEach(async () => {
        const controllers = [ControllerMock];
        const imports = [AirwatchAuthModule];
        const moduleFixture = await Test.createTestingModule({ imports, controllers })
            .overrideProvider(AirwatchAuthService)
            .useValue(airwatchAuthService)
            .overrideProvider(AirwatchUserService)
            .useValue(airwatchUserService)
            .compile();

        app = moduleFixture.createNestApplication();
        (await app.setGlobalPrefix("v1")).init();
    });

    it("should get 401 without Authorization", async () => {
        return request(app.getHttpServer())
            .get("/v1/mock")
            .expect(401)
            .then(response => {
                expect(response.header["www-authenticate"]).toBeTruthy();
                expect(response.body.message).toEqual("User unauthorized");
                expect(response.body.error).toEqual("Unauthorized");
            });
    });

    let token;
    it("should get X-Access-Token when sending Authorization", async () => {
        const user = { username: "test" } as User;
        jest.spyOn(airwatchAuthService, "validateUser").mockResolvedValue(user);
        return request(app.getHttpServer())
            .get("/v1/mock")
            .set("Authorization", "Basic dGVzdDp0ZXN0")
            .expect(200)
            .then(response => {
                expect(response.header["x-access-token"]).toBeTruthy();
                token = response.header["x-access-token"];
            });
    });

    it("should get access with X-Access-Token", async () => {
        const user = { username: "test" } as User;
        jest.spyOn(airwatchAuthService, "validateUser").mockResolvedValue(user);
        return request(app.getHttpServer())
            .get("/v1/mock")
            .set("X-Access-Token", token)
            .expect(200)
            .then(response => {
                expect(response.header["x-access-token"]).toBeTruthy();
            });
    });
});
