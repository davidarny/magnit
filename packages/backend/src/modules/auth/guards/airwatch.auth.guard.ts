import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { TokenExpiredError } from "jsonwebtoken";
import * as _ from "lodash";
import { InvalidTokenException } from "../../../shared/exceptions/invalid-token.exception";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { User } from "../entities/user.entity";
import { JwtTokenManager } from "../providers/jwt.token.manager";
import { AirwatchAuthService } from "../services/airwatch-auth.service";

@Injectable()
export class AirwatchAuthGuard implements CanActivate {
    constructor(
        private readonly airwatchAuthService: AirwatchAuthService,
        private readonly jwtTokenManager: JwtTokenManager<User>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // skip auth if disabled
        if (process.env.ALLOW_AUTH === "false") {
            return true;
        }
        const httpArgumentsHost = context.switchToHttp();
        const req = httpArgumentsHost.getRequest();
        const res = httpArgumentsHost.getResponse();
        const authorization = req.header("Authorization");
        const token = req.header("X-Access-Token");
        if (authorization) {
            const [username, password] = this.getCredentialsFromAuthorizationString(authorization);
            req.user = {
                ...req.user,
                ...(await this.airwatchAuthService.validateUser(username, password)),
            };
            if (!req.user) {
                throw new UserUnauthorizedException("Cannot authorize user");
            }
            res.header("X-Access-Token", this.jwtTokenManager.encode(req.user));
            res.header("Access-Control-Expose-Headers", "X-Access-Token");
            return true;
        } else if (token) {
            try {
                req.user = { ...req.user, ...this.jwtTokenManager.decode(token) };
                res.set("X-Access-Token", token);
                return true;
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
}
