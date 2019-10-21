import { HttpService, Injectable, InternalServerErrorException } from "@nestjs/common";
import { TransformClassToPlain } from "class-transformer";
import * as _ from "lodash";
import { TransformArrayOfClassesToPlainArray } from "../../../shared/decorators/transform-array-of-classes-to-plain-array.decorator";
import { Validate } from "../../../shared/decorators/validate.decorator";
import { User } from "../entities/user.entity";
import { IUserService } from "../interfaces/user.service.interface";
import { LdapService } from "./ldap.service";

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

    constructor(
        private readonly httpService: HttpService,
        private readonly ldapService: LdapService,
    ) {
        if (process.env.NODE_ENV !== "testing" && !this.url) {
            throw new Error("Airwatch base url is undefined");
        }
    }

    @TransformClassToPlain()
    @Validate(InternalServerErrorException)
    async findOne(username: string): Promise<User | undefined> {
        const query = `username=${encodeURI(username)}`;
        const url = `${this.url}/api/system/users/search?${query}`;
        const response = await this.httpService.get(url, this.config).toPromise();
        const users = response.data.Users;
        if (users && Array.isArray(users) && users.length > 0) {
            const user = _.first<IAirWatchUser>(users);
            return new User({
                id: user.Uuid,
                email: user.Email,
                username: user.UserName,
                password: user.UserName,
            });
        }
    }

    @TransformArrayOfClassesToPlainArray()
    @Validate(InternalServerErrorException)
    async findAll(): Promise<User[]> {
        const url = `${this.url}/api/system/users/search`;
        const response = await this.httpService.get(url, this.config).toPromise();
        const users = response.data.Users;
        const ldap = await this.ldapService.findUsers();
        if (users && Array.isArray(users) && users.length > 0) {
            return users
                .filter(user => ldap.includes(user.UserName))
                .map(
                    user =>
                        new User({
                            id: user.Uuid,
                            email: user.Email,
                            username: user.UserName,
                            password: user.UserName,
                        }),
                );
        }
        return [];
    }
}
