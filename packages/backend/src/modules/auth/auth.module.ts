import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";
import { JwtTokenManager } from "./providers/jwt.token.manager";
import { PasswordManager } from "./providers/password.manager";
import { User } from "./entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtTokenManager, PasswordManager],
    exports: [UserService],
})
export class AuthModule {}
