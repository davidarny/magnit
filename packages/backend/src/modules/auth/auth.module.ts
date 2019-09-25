import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { UserService } from "../user/services/user.service";
import { JwtTokenManager } from "./providers/jwt.token.manager";
import { PasswordManager } from "./providers/password.manager";
import { User } from "./entities/user.entity";
import { UserRole } from "./entities/user.role.entity";
import { UserModule } from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole]), UserModule],
    controllers: [AuthController],
    providers: [AuthService, JwtTokenManager, PasswordManager],
})
export class AuthModule {
    constructor(private readonly userService: UserService) {}
}
