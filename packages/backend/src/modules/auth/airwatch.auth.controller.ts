import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiOkResponse, ApiUnauthorizedResponse, ApiUseTags } from "@nestjs/swagger";
import { UserUnauthorizedException } from "../../shared/exceptions/user-unauthorized.exception";
import { ErrorResponse } from "../../shared/responses/error.response";
import { AuthDto } from "./dto/auth.dto";
import { User } from "./entities/user.entity";
import { ITokenManager } from "./interfaces/token.manager.interface";
import { JwtTokenManager } from "./providers/jwt.token.manager";
import { AuthResponse } from "./reponses/auth.response";
import { AirwatchAuthService } from "./services/airwatch-auth.service";

@Controller("auth")
@ApiUseTags("auth")
export class AirwatchAuthController {
    constructor(
        private readonly airwatchAuthService: AirwatchAuthService,
        @Inject(JwtTokenManager) private readonly tokenManager: ITokenManager<User>,
    ) {}

    @Post("/")
    @ApiOkResponse({ description: "User successfully authorized", type: AuthResponse })
    @ApiUnauthorizedResponse({ description: "Cannot authorize user", type: ErrorResponse })
    async auth(@Body() authDto: AuthDto) {
        const user = await this.airwatchAuthService.validateUser(
            authDto.username,
            authDto.password,
        );
        if (!user) {
            throw new UserUnauthorizedException("Cannot authorize user");
        }
        const token = this.tokenManager.encode(user);
        return { success: 1, token };
    }
}
