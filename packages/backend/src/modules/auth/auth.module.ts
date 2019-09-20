import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";

@Module({
    controllers: [AuthController],
    providers: [AuthService, UserService],
})
export class AuthModule {}
