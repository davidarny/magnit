import { Inject, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { IAuthRequest } from "../../../shared/interfaces/auth.request.interface";
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
                throw new UnauthorizedException(message);
            }
        }
        if (authorization) {
            const credentials = authorization.split(" ")[1];
            const data = Buffer.from(credentials, "base64").toString();
            const username = _.first(data.split(":"));
            const password = _.last(data.split(":"));
            req.user = await this.authService.validateUser(username, password);
            if (!req.user) {
                throw new UnauthorizedException("Cannot authorize user");
            }
            res.header("X-Access-Token", this.tokenManager.encode(req.user));
            return next();
        }
        res.set("WWW-Authenticate", "Basic");
        throw new UnauthorizedException("User unauthorized");
    }
}
