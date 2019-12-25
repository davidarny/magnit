import { HttpService, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { TransformClassToPlain } from "class-transformer";
import * as _ from "lodash";
import { TransformArrayOfClassesToPlainArray } from "../../../shared/decorators/transform-array-of-classes-to-plain-array.decorator";
import { Validate } from "../../../shared/decorators/validate.decorator";
import { User } from "../entities/user.entity";
import { IUserService } from "../interfaces/user.service.interface";
import { LdapService } from "./ldap.service";
import { AxiosResponse } from "axios";

interface IAirWatchUser {
    UserName?: string;
    FirstName?: string;
    LastName?: string;
    Email?: string;
    Status?: boolean;
    Role?: string;
    Uuid?: string;
}

interface ISearchUsersResponse {
    Users: IAirWatchUser;
}

@Injectable()
export class AirwatchUserService implements IUserService {
    private readonly logger = new Logger(AirwatchUserService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly ldapService: LdapService,
    ) {}

    @TransformClassToPlain()
    @Validate(InternalServerErrorException)
    async findOne(username: string): Promise<User | undefined> {
        const query = `username=${encodeURI(username)}`;
        let response: AxiosResponse<ISearchUsersResponse> | null = null;
        try {
            response = await this.httpService
                .get<ISearchUsersResponse>(`system/users/search?${query}`)
                .toPromise();
        } catch (error) {
            this.logger.debug("Failed to fetch user");
            this.logger.error(error);
        }
        if (!response) {
            return;
        }
        const users = response.data.Users;
        if (users && Array.isArray(users) && users.length > 0) {
            const user = _.first(users);
            return new User({
                id: user.Uuid,
                email: user.Email,
                username: user.UserName,
                firstName: user.FirstName,
                lastName: user.LastName,
            });
        }
    }

    @TransformArrayOfClassesToPlainArray()
    @Validate(InternalServerErrorException)
    async findAll(): Promise<User[]> {
        let response: AxiosResponse<ISearchUsersResponse> | null = null;
        try {
            response = await this.httpService
                .get<ISearchUsersResponse>("system/users/search")
                .toPromise();
        } catch (error) {
            this.logger.debug("Failed to fetch users");
            this.logger.error(error);
        }
        if (!response) {
            return [];
        }
        const users = response.data.Users;
        if (users && Array.isArray(users) && users.length > 0) {
            const ldap = await this.ldapService.findUsers();
            return users
                .filter(user => ldap.includes(user.UserName))
                .map(
                    user =>
                        new User({
                            id: user.Uuid,
                            email: user.Email,
                            username: user.UserName,
                            firstName: user.FirstName,
                            lastName: user.LastName,
                        }),
                );
        }
        return [];
    }
}
