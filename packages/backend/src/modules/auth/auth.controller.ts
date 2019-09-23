import { InjectRepository } from "@nestjs/typeorm";
import { Controller, Body, Post, Inject } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { AuthService } from "./services/auth.service";
import { ApiImplicitBody } from "@nestjs/swagger";
// import { try } from "bluebird";

@Controller("auth")
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        console.log(authService);
    }

    @Post("/register")
    async register(@Body() userInfo: CreateUserDTO) {
        let user = new User(userInfo);
        console.log(this.authService);
        try {
            const saved = await this.authService.createUser(user);
            return { success: 1, user: saved };
        } catch (err) {
            console.log(err);
        }
    }

    @Post("/login")
    async login(@Body() mail: string, password: string) {
        return;
    }
}
