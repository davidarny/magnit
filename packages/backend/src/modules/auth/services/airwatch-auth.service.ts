import { Inject, Injectable } from "@nestjs/common";
import { IPublicUser } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth.service.interface";
import { IUserService } from "../interfaces/user.service.interface";
import { AirwatchUserService } from "./airwatch-user.service";

@Injectable()
export class AirwatchAuthService implements IAuthService {
    constructor(@Inject(AirwatchUserService) private readonly userService: IUserService) {}

    async validateUser(username: string, password: string): Promise<IPublicUser | null> {
        // TODO: validate user password
        return undefined;
    }
}
