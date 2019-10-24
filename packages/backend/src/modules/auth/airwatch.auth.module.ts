import { Module } from "@nestjs/common";
import { AirwatchHttpModule } from "../http/http.module";
import { AirwatchAuthController } from "./airwatch.auth.controller";
import { JwtTokenManager } from "./providers/jwt.token.manager";
import { AirwatchAuthService } from "./services/airwatch-auth.service";
import { AirwatchUserService } from "./services/airwatch-user.service";
import { LdapService } from "./services/ldap.service";

@Module({
    imports: [AirwatchHttpModule],
    controllers: [AirwatchAuthController],
    providers: [AirwatchAuthService, AirwatchUserService, JwtTokenManager, LdapService],
    exports: [AirwatchAuthService, AirwatchUserService, JwtTokenManager, LdapService],
})
export class AirwatchAuthModule {}
