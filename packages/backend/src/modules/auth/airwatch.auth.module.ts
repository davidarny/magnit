import { HttpModule, Module } from "@nestjs/common";
import { AirwatchAuthController } from "./airwatch.auth.controller";
import { JwtTokenManager } from "./providers/jwt.token.manager";
import { AirwatchAuthService } from "./services/airwatch-auth.service";
import { AirwatchUserService } from "./services/airwatch-user.service";
import { LdapService } from "./services/ldap.service";

@Module({
    imports: [
        HttpModule.register({
            timeout: Number(process.env.HTTP_TIMEOUT),
            maxRedirects: Number(process.env.HTTP_MAX_REDIRECTS),
        }),
    ],
    controllers: [AirwatchAuthController],
    providers: [AirwatchAuthService, AirwatchUserService, JwtTokenManager, LdapService],
    exports: [AirwatchAuthService, AirwatchUserService, JwtTokenManager, LdapService],
})
export class AirwatchAuthModule {}
