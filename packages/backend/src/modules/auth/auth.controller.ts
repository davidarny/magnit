import { InjectRepository } from "@nestjs/typeorm";
import { Controller, Body, Post, Request, Inject, UsePipes } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { LoginUserDTO } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { AuthService } from "./services/auth.service";
import { ApiImplicitBody, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
import { AuthResponse } from "./responses/user-register.response";
// import { try } from "bluebird";

@ApiUseTags("auth")
@Controller("auth")
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {}

    @Post("/register")
    @ApiImplicitBody({ name: "user", type: CreateUserDTO, description: "User info" })
    @ApiOkResponse({ type: AuthResponse, description: "Register user" })
    async register(@Body(new ValidationPipe()) userInfo: CreateUserDTO) {
        let user = new User(userInfo);
        const savedUser = await this.authService.createUser(user);
        const token = this.authService.getTokenFor(savedUser);
        return { success: 1, token: token, id: savedUser.id };
    }

    @Post("/login")
    @UsePipes(ValidationPipe)
    @ApiOkResponse({ type: AuthResponse, description: "Register user" })
    async login(@Body() loginUserDTO: LoginUserDTO) {
        const user = await this.authService.validateUser(loginUserDTO.email, loginUserDTO.password);
        const token = this.authService.getTokenFor(user);
        return { success: 1, token: token, id: user.id };
    }
}
