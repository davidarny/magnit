import { HttpService, Injectable, UnauthorizedException } from "@nestjs/common";
import { TransformClassToPlain } from "class-transformer";
import { Validate } from "../../../shared/decorators/validate.decorator";
import { User } from "../entities/user.entity";
import { IUserService } from "../interfaces/user.service.interface";
import _ = require("lodash");

@Injectable()
export class AirwatchUserService implements IUserService {
    private readonly url = process.env.AIRWATCH_BASE_URL;
    private readonly config = {
        headers: {
            common: {
                Authorization: `Basic ${process.env.AIRWATCH_AUTH}`,
                "aw-tenant-code": process.env.AIRWATCH_TENANT_CODE,
                "Content-Type": "application/json",
            },
        },
    };

    constructor(private readonly httpService: HttpService) {
        if (process.env.NODE_ENV !== "testing" && !this.url) {
            throw new Error("Airwatch base url is undefined");
        }
    }

    @TransformClassToPlain()
    @Validate(false, UnauthorizedException)
    async findOne(username: string): Promise<User | undefined> {
        const query = `username=${encodeURI(username)}`;
        const url = `${this.url}/api/system/users/search?${query}`;
        const response = await this.httpService.get(url, this.config).toPromise();
        if (
            response.data.Users &&
            Array.isArray(response.data.Users) &&
            response.data.Users.length > 0
        ) {
            const foundUser = _.first<any>(response.data.Users);
            return new User({
                username: foundUser.UserName,
                password: foundUser.UserName,
            });
        }
        throw new UnauthorizedException("Cannot authorize user");
    }
}
