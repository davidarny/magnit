import { Injectable } from "@nestjs/common";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { LoginUserDto } from "../dto/login-user.dto";
import { User } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth.service.interface";
import { JwtTokenManager } from "../providers/jwt.token.manager";
import { AirwatchUserService } from "./airwatch-user.service";

@Injectable()
export class AirwatchAuthService implements IAuthService {
    constructor(
        private readonly airwatchUserService: AirwatchUserService,
        private readonly jwtTokenManager: JwtTokenManager<User>,
    ) {}

    async validateUser(username: string, password: string): Promise<User | undefined> {
        return this.airwatchUserService.findOne(username);
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.validateUser(loginUserDto.username, loginUserDto.password);
        if (!user) {
            throw new UserUnauthorizedException("Cannot authorize user");
        }
        return this.jwtTokenManager.encode(user);
    }
}
