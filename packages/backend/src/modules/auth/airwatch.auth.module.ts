import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AirwatchAuthMiddleware } from "./middleware/airwatch.auth.middleware";
import { AirwatchAuthService } from "./services/airwatch-auth.service";
import { AirwatchUserService } from "./services/airwatch-user.service";
import { JwtTokenManager } from "./providers/jwt.token.manager";

const providers = [AirwatchAuthService, AirwatchUserService, JwtTokenManager];

@Module({ providers })
export class AirwatchAuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        if (process.env.ALLOW_AUTH || process.env.NODE_ENV !== "testing") {
            consumer
                .apply(AirwatchAuthMiddleware)
                .forRoutes({ path: "*", method: RequestMethod.ALL });
        }
    }
}
