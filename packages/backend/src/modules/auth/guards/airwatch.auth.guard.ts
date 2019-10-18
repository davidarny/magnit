import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { TokenExpiredError } from "jsonwebtoken";
import * as _ from "lodash";
import { InvalidTokenException } from "../../../shared/exceptions/invalid-token.exception";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { IAuthRequest } from "../../../shared/interfaces/auth.request.interface";
import { PushTokenService } from "../../push-token/services/push-token.service";
import { User } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth.service.interface";
import { ITokenManager } from "../interfaces/token.manager.interface";
import { JwtTokenManager } from "../providers/jwt.token.manager";
import { AirwatchAuthService } from "../services/airwatch-auth.service";

@Injectable()
export class AirwatchAuthGuard implements CanActivate {
    constructor(
        @Inject(AirwatchAuthService) private readonly authService: IAuthService,
        @Inject(JwtTokenManager) private readonly tokenManager: ITokenManager<User>,
        private readonly pushTokenService: PushTokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpArgumentsHost = context.switchToHttp();
        const req = httpArgumentsHost.getRequest();
        const res = httpArgumentsHost.getResponse();
        const next = httpArgumentsHost.getNext();
        const authorization = req.header("Authorization");
        const token = req.header("X-Access-Token");
        if (authorization) {
            const [username, password] = this.getCredentialsFromAuthorizationString(authorization);
            req.user = await this.authService.validateUser(username, password);
            if (!req.user) {
                throw new UserUnauthorizedException("Cannot authorize user");
            }
            res.header("X-Access-Token", this.tokenManager.encode(req.user));
            res.header("Access-Control-Expose-Headers", "X-Access-Token");
            // try to get push tokens
            await this.setPushTokenIfExists(req.user);
            return next();
        } else if (token) {
            try {
                req.user = this.tokenManager.decode(token);
                res.set("X-Access-Token", token);
                // try to get push tokens
                await this.setPushTokenIfExists(req.user);
                return next();
            } catch (error) {
                let message = 'Invalid "X-Access-Token"';
                if (error instanceof TokenExpiredError) {
                    message = "Token has expired";
                }
                throw new InvalidTokenException(message);
            }
        }
        res.set("WWW-Authenticate", "Basic");
        throw new UserUnauthorizedException("User unauthorized");
    }

    // returns tuple with username & password
    private getCredentialsFromAuthorizationString(authorization: string): [string, string] {
        const credentials = authorization.split(" ")[1];
        const data = Buffer.from(credentials, "base64").toString();
        const username = _.first(data.split(":"));
        const password = _.last(data.split(":"));
        return [username, password];
    }

    private async setPushTokenIfExists(user: IAuthRequest["user"]): Promise<void> {
        const pushTokens = await this.pushTokenService.getTokensByUserId(user.id);
        if (pushTokens) {
            user.tokens = pushTokens.map(pushToken => pushToken.token);
        }
    }
}
