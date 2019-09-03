import { Inject, NestMiddleware } from "@nestjs/common";
import { Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { InvalidTokenException } from "../../../shared/exceptions/invalid-token.exception";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { IAuthRequest } from "../../../shared/interfaces/auth.request.interface";
import { IPushTokenService } from "../../push-token/interfaces/push-token.service.interface";
import { PushTokenService } from "../../push-token/services/push-token.service";
import { User } from "../entities/user.entity";
import { IAuthService } from "../interfaces/auth.service.interface";
import { ITokenManager } from "../interfaces/token.manager.interface";
import { JwtTokenManager } from "../providers/jwt.token.manager";
import { AirwatchAuthService } from "../services/airwatch-auth.service";
import _ = require("lodash");

export class AirwatchAuthMiddleware implements NestMiddleware<IAuthRequest, Response> {
    constructor(
        @Inject(AirwatchAuthService) private readonly authService: IAuthService,
        @Inject(JwtTokenManager) private readonly tokenManager: ITokenManager<User>,
        @Inject(PushTokenService) private readonly pushTokenService: IPushTokenService,
    ) {}

    async use(req: IAuthRequest, res: Response, next: () => void): Promise<void> {
        const authorization = req.header("Authorization");
        const token = req.header("X-Access-Token");
        if (token) {
            try {
                req.user = this.tokenManager.decode(token);
                res.set("X-Access-Token", token);
                return next();
            } catch (error) {
                let message = 'Invalid "X-Access-Token"';
                if (error instanceof TokenExpiredError) {
                    message = "Token has expired";
                }
                throw new InvalidTokenException(message);
            }
        }
        if (authorization) {
            const [username, password] = this.getCredentialsFromAuthorizationString(authorization);
            req.user = await this.authService.validateUser(username, password);
            // try to get push token
            await this.setPushTokenIfExists(req.user);
            if (!req.user) {
                throw new UserUnauthorizedException("Cannot authorize user");
            }
            res.header("X-Access-Token", this.tokenManager.encode(req.user));
            return next();
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
        const pushToken = await this.pushTokenService.getTokenByUserId(user.id);
        if (pushToken) {
            user.token = pushToken.token;
        }
    }
}
