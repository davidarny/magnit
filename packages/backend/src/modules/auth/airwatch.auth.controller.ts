import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiOkResponse, ApiUnauthorizedResponse, ApiUseTags } from "@nestjs/swagger";
import { UserUnauthorizedException } from "../../shared/exceptions/user-unauthorized.exception";
import { ErrorResponse } from "../../shared/responses/error.response";
import { LoginUserDto } from "./dto/login-user.dto";
import { User } from "./entities/user.entity";
import { ITokenManager } from "./interfaces/token.manager.interface";
import { JwtTokenManager } from "./providers/jwt.token.manager";
import { LoginUserResponse } from "./reponses/login-user.response";
import { AirwatchAuthService } from "./services/airwatch-auth.service";

@Controller("auth")
@ApiUseTags("auth")
export class AirwatchAuthController {
    constructor(
        private readonly airwatchAuthService: AirwatchAuthService,
        @Inject(JwtTokenManager) private readonly tokenManager: ITokenManager<User>,
    ) {}

    @Post("/login")
    @ApiOkResponse({ description: "User successfully authorized", type: LoginUserResponse })
    @ApiUnauthorizedResponse({ description: "Cannot authorize user", type: ErrorResponse })
    async login(@Body() loginUserDto: LoginUserDto) {
        const user = await this.airwatchAuthService.validateUser(
            loginUserDto.username,
            loginUserDto.password,
        );
        if (!user) {
            throw new UserUnauthorizedException("Cannot authorize user");
        }
        const token = this.tokenManager.encode(user);
        return { success: 1, token };
    }
}
