import { HttpService, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { TransformClassToPlain } from "class-transformer";
import * as _ from "lodash";
import { TransformArrayOfClassesToPlainArray } from "../../../shared/decorators/transform-array-of-classes-to-plain-array.decorator";
import { Validate } from "../../../shared/decorators/validate.decorator";
import { User } from "../entities/user.entity";
import { IUserService } from "../interfaces/user.service.interface";
import { AirwatchAPI } from "./airwatch";
import { LdapService } from "./ldap.service";
import { AxiosResponse } from "axios";

@Injectable()
export class AirwatchUserService implements IUserService {
    private readonly logger = new Logger(AirwatchUserService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly ldapService: LdapService,
    ) {}

    @TransformClassToPlain()
    @Validate(InternalServerErrorException)
    async UNSAFE_findOne(username: string): Promise<User | undefined> {
        const query = `username=${encodeURI(username)}`;
        let response: AxiosResponse<AirwatchAPI.System.Users.Search.IResponse> | null = null;
        try {
            response = await this.httpService
                .get<AirwatchAPI.System.Users.Search.IResponse>(`system/users/search?${query}`)
                .toPromise();
        } catch (error) {
            this.logger.error("Failed to fetch user", error);
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

    @TransformClassToPlain()
    @Validate(InternalServerErrorException)
    async findOne(username: string): Promise<User | undefined> {
        return await this.findDeviceByUserName(username)
            .then(async devices => {
                if (!devices) {
                    return;
                }
                const device = _.first(devices);
                return this.findUserByDevice(device);
            })
            .then(user => {
                if (!user) {
                    return;
                }
                return new User({
                    id: user.Uuid,
                    email: user.Email,
                    username: user.UserName,
                    firstName: user.FirstName,
                    lastName: user.LastName,
                });
            });
    }

    /** @deprecated */
    @TransformArrayOfClassesToPlainArray()
    @Validate(InternalServerErrorException)
    async UNSAFE_findAll(): Promise<User[]> {
        type TUsersSearchResponse = AirwatchAPI.System.Users.Search.IResponse;

        let response: AxiosResponse<TUsersSearchResponse> | null = null;
        try {
            response = await this.httpService
                .get<TUsersSearchResponse>("system/users/search")
                .toPromise();
        } catch (error) {
            this.logger.error("Failed to fetch users", error);
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

    @TransformArrayOfClassesToPlainArray()
    @Validate(InternalServerErrorException)
    async findAll() {
        const users = await this.ldapService.findUsers();
        const responses = await Promise.all(
            users
                // find all devices that match given common name (cn)
                .map(async cn => this.findDeviceByUserName(cn))
                // get user details of device
                .map(async promise => {
                    const devices = await promise;
                    if (!devices) {
                        return false;
                    }
                    const device = _.first(devices);
                    const user = await this.findUserByDevice(device);
                    if (!user) {
                        return false;
                    }
                    return new User({
                        id: user.Uuid,
                        email: user.Email,
                        username: user.UserName,
                        firstName: user.FirstName,
                        lastName: user.LastName,
                    });
                }),
        );
        return responses.filter(response => response) as User[];
    }

    private async findUserByDevice(device: AirwatchAPI.MDM.Devices.IDevice) {
        type TUserDetailsResponse = AirwatchAPI.MDM.Devices.User.IResponse;

        let response: AxiosResponse<TUserDetailsResponse> | null = null;
        try {
            const url = `mdm/devices/${device.Id.Value}/user`;
            this.logger.debug(url, "AirwatchAPI");
            response = await this.httpService.get<TUserDetailsResponse>(url).toPromise();
        } catch (error) {
            this.logger.error("Failed to fetch user details", error);
        }
        if (!response) {
            return;
        }

        return response.data.DeviceUser;
    }

    private async findDeviceByUserName(cn: string) {
        type TDeviceSearchResponse = AirwatchAPI.MDM.Devices.Search.IResponse;

        let response: AxiosResponse<TDeviceSearchResponse> | null = null;
        try {
            const url = `mdm/devices/search?user=${cn}`;
            this.logger.debug(url, "AirwatchAPI");
            response = await this.httpService.get<TDeviceSearchResponse>(url).toPromise();
        } catch (error) {
            this.logger.error("Failed to fetch device details", error);
        }
        if (!response) {
            return;
        }

        return response.data.Devices;
    }
}
