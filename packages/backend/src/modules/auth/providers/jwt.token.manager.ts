import { Injectable } from "@nestjs/common";
import { TokenManager } from "./token.manager";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JWTTokenManager<T extends object> extends TokenManager<T> {
    protected readonly algorithm = process.env.AUTH_ALGORITHM || "HS256";
    protected readonly expires = process.env.AUTH_EXPIRES_IN || "1h";

    decode(token: string): T {
        return jwt.verify(this.decrypt(token), this.secret, { algorithms: [this.algorithm] }) as T;
    }

    encode(payload: T): string {
        return this.encrypt(
            jwt.sign(payload, this.secret, {
                algorithm: this.algorithm,
                expiresIn: this.expires,
            }),
        );
    }
}
