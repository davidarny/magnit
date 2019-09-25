import { InjectRepository } from "@nestjs/typeorm";
import { Controller, Body, Post, Request, Inject } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { LoginUserDTO } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { AuthService } from "./services/auth.service";
import { ApiImplicitBody, ApiUseTags } from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
// import { try } from "bluebird";

@ApiUseTags("auth")
@Controller("auth")
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        console.log(authService);
    }

    @Post("/register")
    @ApiImplicitBody({ name: "user", type: CreateUserDTO, description: "User info" })
    async register(@Body(new ValidationPipe()) userInfo: CreateUserDTO) {
        let user = new User(userInfo);
        const saved = await this.authService.createUser(user);
        return { success: 1, user: saved };
    }

    @Post("/login")
    async login(@Body(new ValidationPipe()) loginUserDTO: LoginUserDTO) {
        const user = await this.authService.validateUser(loginUserDTO.email, loginUserDTO.password);
        return { success: 1, user: user };
    }
}
