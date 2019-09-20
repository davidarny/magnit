import { Injectable, Inject } from "@nestjs/common";

import { User } from "../entities/user.entity";
import { IAuthService } from "../interface/auth.service.interface";
import { UserService } from "./user.service";
import { IUserService } from "../interface/user.service.interface";

@Injectable()
export class AuthService implements IAuthService {
    constructor(@Inject(UserService) private readonly userService: IUserService) {}

    async validateUser(username: string, pass: string): Promise<User | undefined> {
        return this.userService.findOne(username);
    }
}
