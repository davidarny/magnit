import { Controller, Get } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { AirwatchAuthModule } from "../src/modules/auth/airwatch.auth.module";
import { IPublicUser, User } from "../src/modules/auth/entities/user.entity";
import { IAuthService } from "../src/modules/auth/interfaces/auth.service.interface";
import { IUserService } from "../src/modules/auth/interfaces/user.service.interface";
import { AirwatchAuthService } from "../src/modules/auth/services/airwatch-auth.service";
import { AirwatchUserService } from "../src/modules/auth/services/airwatch-user.service";

@Controller("mock")
class ControllerMock {
    @Get("/")
    get() {}
}

export abstract class AirwatchAuthServiceMock implements IAuthService {
    abstract validateUser(username: string, password: string): Promise<IPublicUser | null>;
}

export abstract class AirwatchUserServiceMock implements IUserService {
    abstract findOne(username: string): Promise<User | undefined>;
}

describe("Airwatch Auth", () => {
    let app: NestApplication;

    beforeAll(() => {
        // allow auth middleware
        process.env.ALLOW_AUTH = "true";
    });

    afterAll(() => {
        // reset allowance
        process.env.ALLOW_AUTH = undefined;
    });

    beforeEach(async () => {
        const providers = [
            {
                provide: AirwatchAuthService,
                useValue: AirwatchAuthServiceMock,
            },
            {
                provide: AirwatchUserService,
                useValue: AirwatchUserServiceMock,
            },
        ];
        const controllers = [ControllerMock];
        const imports = [AirwatchAuthModule];
        const moduleFixture = await Test.createTestingModule({
            imports,
            controllers,
            providers,
        }).compile();

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
        return request(app.getHttpServer())
            .get("/v1/mock")
            .set("X-Access-Token", token)
            .expect(200)
            .then(response => {
                expect(response.header["x-access-token"]).toBeTruthy();
            });
    });
});
