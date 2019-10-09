import { HttpModule, MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { UserService } from "../user/services/user.service";
import { JWTTokenManager } from "./providers/jwt.token.manager";
import { PasswordManager } from "./providers/password.manager";
import { User } from "../user/entities/user.entity";
import { UserRole } from "../user/entities/user.role.entity";
import { UserModule } from "../user/user.module";
import { PushTokenModule } from "../push-token/push-token.module";
import { AuthMiddleware } from "./middleware/auth.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole]), UserModule, PushTokenModule],
    controllers: [AuthController],
    providers: [AuthService, JWTTokenManager, PasswordManager],
})
export class AuthModule {
    constructor(private readonly userService: UserService) {}
    configure(consumer: MiddlewareConsumer) {
        if (process.env.ALLOW_AUTH || process.env.NODE_ENV !== "testing") {
            consumer
                .apply(AuthMiddleware)
                .exclude({ path: "/auth", method: RequestMethod.ALL })
                .forRoutes({ path: "*", method: RequestMethod.ALL });
        }
    }
}
