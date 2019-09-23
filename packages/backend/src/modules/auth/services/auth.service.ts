import { Injectable, Inject } from "@nestjs/common";

import { User } from "../entities/user.entity";
import { CreateUserDTO } from "../dto/create-user.dto";
import { UserService } from "./user.service";

@Injectable()
export class AuthService {
    constructor(@Inject(UserService) private readonly userService: UserService) {}

    async validateUser(username: string, pass: string) {
        return this.userService.findOne(username);
    }

    async createUser(user: User) {
        console.log("asdasd");
        const res = await this.userService.create(user);
        return res;
    }
}
