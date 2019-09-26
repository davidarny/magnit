import { InjectRepository } from "@nestjs/typeorm";
import { Controller, Body, Post, Request, Inject, UsePipes } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { LoginUserDTO } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { AuthService } from "./services/auth.service";
import { ApiImplicitBody, ApiUseTags } from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
import { UserByEmailPipe } from "./pipes/user-by-email.pipes";
// import { try } from "bluebird";

@ApiUseTags("auth")
@Controller("auth")
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {}

    @Post("/register")
    @ApiImplicitBody({ name: "user", type: CreateUserDTO, description: "User info" })
    async register(@Body(new ValidationPipe()) userInfo: CreateUserDTO) {
        console.log("register reqquest");
        let user = new User(userInfo);
        const savedUser = await this.authService.createUser(user);
        const token = this.authService.getTokenFor(savedUser);
        return { success: 1, user: savedUser, token: token };
    }

    @Post("/login")
    @UsePipes(ValidationPipe)
    // @UsePipes(UserByEmailPipe)
    async login(@Body(new ValidationPipe()) loginUserDTO: LoginUserDTO) {
        console.log("login reqquest");
        const user = await this.authService.validateUser(loginUserDTO.email, loginUserDTO.password);
        const token = this.authService.getTokenFor(user);
        return { success: 1, user: user, token: token };
    }
}
