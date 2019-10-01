import { Controller, Body, Post, Inject, UsePipes } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { AuthService } from "./services/auth.service";
import { ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { ValidationPipe } from "../../shared/pipes/validation.pipe";
import { AuthResponse } from "./responses/user-register.response";
import { Transactional } from "typeorm-transactional-cls-hooked";
// import { try } from "bluebird";

@ApiUseTags("auth")
@Controller("auth")
export class AuthController {
    constructor(@Inject(AuthService) private readonly authService: AuthService) {}

    @Post("/register")
    @Transactional()
    @UsePipes(ValidationPipe)
    @ApiOkResponse({ type: AuthResponse, description: "Register user" })
    async register(@Body() userInfo: CreateUserDto) {
        return this.authService.register(userInfo);
    }

    @Post("/login")
    @Transactional()
    @ApiOkResponse({ type: AuthResponse, description: "Login user" })
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }
}
