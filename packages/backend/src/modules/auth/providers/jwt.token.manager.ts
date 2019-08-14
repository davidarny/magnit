import { Injectable } from "@nestjs/common";
import { TokenManagerImpl } from "./token.manager.impl";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtTokenManager<T extends object> extends TokenManagerImpl<T> {
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
