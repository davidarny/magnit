import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiUnauthorizedResponse, ApiUseTags } from "@nestjs/swagger";
import { ErrorResponse } from "../../shared/responses/error.response";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { AirwatchAuthGuard } from "./guards/airwatch.auth.guard";
import { LoginUserResponse } from "./reponses/login-user.response";
import { AirwatchAuthService } from "./services/airwatch-auth.service";
import { AirwatchUserService } from "./services/airwatch-user.service";

@Controller("auth")
@ApiUseTags("auth")
export class AirwatchAuthController {
    constructor(
        private readonly airwatchAuthService: AirwatchAuthService,
        private readonly airwatchUserService: AirwatchUserService,
    ) {}

    @Post("/login")
    @ApiOkResponse({ description: "User successfully authorized", type: LoginUserResponse })
    @ApiUnauthorizedResponse({ description: "Cannot authorize user", type: ErrorResponse })
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.airwatchAuthService.login(loginUserDto);
        return { success: 1, token };
    }

    @Get("/users")
    @UseGuards(AirwatchAuthGuard)
    @ApiOkResponse({ description: "All Users", type: [User] })
    @ApiUnauthorizedResponse({ description: "Cannot authorize user", type: ErrorResponse })
    async getAllUsers() {
        return this.airwatchUserService.findAll();
    }
}
