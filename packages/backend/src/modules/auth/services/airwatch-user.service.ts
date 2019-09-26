import { HttpService, Injectable } from "@nestjs/common";
import { TransformClassToPlain } from "class-transformer";
import * as _ from "lodash";
import { Validate } from "../../../shared/decorators/validate.decorator";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { User } from "../entities/user.entity";
import { IUserService } from "../interfaces/user.service.interface";

interface IAirWatchUser {
    UserName?: string;
    Email?: string;
    Status?: boolean;
    Role?: string;
    Uuid?: string;
}

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
    @Validate(UserUnauthorizedException)
    async findOne(username: string): Promise<User | undefined> {
        const query = `username=${encodeURI(username)}`;
        const url = `${this.url}/api/system/users/search?${query}`;
        const response = await this.httpService.get(url, this.config).toPromise();
        if (
            response.data.Users &&
            Array.isArray(response.data.Users) &&
            response.data.Users.length > 0
        ) {
            const user = _.first<IAirWatchUser>(response.data.Users);
            return new User({
                id: user.Uuid,
                email: user.Email,
                username: user.UserName,
                password: user.UserName,
            });
        }
        throw new UserUnauthorizedException("Cannot authorize user");
    }
}
