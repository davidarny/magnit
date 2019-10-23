import { Injectable } from "@nestjs/common";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { LoginUserDto } from "../dto/login-user.dto";
import { User } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth.service.interface";
import { JwtTokenManager } from "../providers/jwt.token.manager";
import { AirwatchUserService } from "./airwatch-user.service";
import { LdapService } from "./ldap.service";

@Injectable()
export class AirwatchAuthService implements IAuthService {
    constructor(
        private readonly ldapService: LdapService,
        private readonly airwatchUserService: AirwatchUserService,
        private readonly jwtTokenManager: JwtTokenManager<User>,
    ) {}

    async validateUser(username: string, password: string): Promise<User | undefined> {
        const authenticated = await this.ldapService.authenticate(username, password);
        if (!authenticated) {
            throw new UserUnauthorizedException("User unauthorized");
        }
        return this.airwatchUserService.findOne(username);
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.validateUser(loginUserDto.username, loginUserDto.password);
        const groups = await this.ldapService.getGroupMembershipForUser(loginUserDto.username);
        if (!user || (process.env.LDAP_USER_ROLE && !groups.includes(process.env.LDAP_USER_ROLE))) {
            throw new UserUnauthorizedException("User unauthorized");
        }
        return this.jwtTokenManager.encode(user);
    }
}
