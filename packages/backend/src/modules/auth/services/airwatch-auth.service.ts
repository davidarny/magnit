import { Injectable, Logger } from "@nestjs/common";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { LoginUserDto } from "../dto/login-user.dto";
import { User } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth.service.interface";
import { JwtTokenManager } from "../providers/jwt.token.manager";
import { AirwatchUserService } from "./airwatch-user.service";
import { LdapService } from "./ldap.service";

@Injectable()
export class AirwatchAuthService implements IAuthService {
    private readonly logger = new Logger(AirwatchAuthService.name);

    constructor(
        private readonly ldapService: LdapService,
        private readonly airwatchUserService: AirwatchUserService,
        private readonly jwtTokenManager: JwtTokenManager<User>,
    ) {}

    async validateUser(username: string, password: string): Promise<User | undefined> {
        let authenticated = false;
        try {
            authenticated = await this.ldapService.authenticate(username, password);
        } catch (error) {
            this.logger.debug("Authentication failed");
            this.logger.error(error);
        }
        if (!authenticated) {
            throw new UserUnauthorizedException("User unauthorized");
        }
        return this.airwatchUserService.findOne(username);
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        let user: User | null = null;
        try {
            user = await this.validateUser(loginUserDto.username, loginUserDto.password);
        } catch (error) {
            this.logger.debug("User not found");
            this.logger.error(error);
        }
        let groups: string[] = [];
        try {
            groups = await this.ldapService.getGroupMembershipForUser(loginUserDto.username);
        } catch (error) {
            this.logger.debug("Group membership for user failed");
            this.logger.error(error);
        }
        if (
            !user ||
            !groups ||
            (process.env.LDAP_USER_ROLE && !groups.includes(process.env.LDAP_USER_ROLE))
        ) {
            throw new UserUnauthorizedException("User unauthorized");
        }
        return this.jwtTokenManager.encode(user);
    }
}
