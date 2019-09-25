import { Injectable } from "@nestjs/common";
import { CryptManager } from "./crypt.manager";

@Injectable()
export class PasswordManager extends CryptManager<string> {
    encode(password: string): string {
        return this.encrypt(password);
    }

    decode(hash: string): string {
        return this.decrypt(hash);
    }
}
