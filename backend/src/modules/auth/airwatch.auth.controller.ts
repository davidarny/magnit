import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiUseTags } from "@nestjs/swagger";
import { ErrorResponse } from "../../shared/responses/error.response";
import { LoginUserDto } from "./dto/login-user.dto";
import { AirwatchAuthGuard } from "./guards/airwatch.auth.guard";
import { GetAllUsersResponse } from "./reponses/get-all-users.response";
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
    @ApiUnauthorizedResponse({ description: "User unauthorized", type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: "Cannot authorize user", type: ErrorResponse })
    async login(@Body() loginUserDto: LoginUserDto) {
        const token = await this.airwatchAuthService.login(loginUserDto);
        return { success: 1, token };
    }

    @Get("/users")
    @ApiBearerAuth()
    @UseGuards(AirwatchAuthGuard)
    @ApiOkResponse({ description: "All Users", type: GetAllUsersResponse })
    @ApiUnauthorizedResponse({ description: "User unauthorized", type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: "Cannot authorize user", type: ErrorResponse })
    async getAllUsers() {
        const users = await this.airwatchUserService.findAll();
        return { success: 1, users };
    }
}
