import { ITokenManager } from "../interfaces/token.manager.interface";
import * as crypto from "crypto";

export abstract class TokenManagerImpl<T> implements ITokenManager<T> {
    // for AES, this is always 16
    private static readonly IV_LENGTH = 16;

    // must be 256 bits (32 characters)
    protected readonly secret = process.env.AUTH_SECRET;
    protected readonly algorithm = process.env.AUTH_ALGORITHM || "HS256";
    protected readonly expires = process.env.AUTH_EXPIRES_IN || "1h";

    constructor() {
        if (process.env.NODE_ENV !== "testing" && !this.secret) {
            throw new Error("Auth secret is undefined");
        }
    }

    protected encrypt(token: string): string {
        const iv = crypto.randomBytes(TokenManagerImpl.IV_LENGTH);
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(this.secret), iv);
        let encrypted = cipher.update(token);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }

    protected decrypt(token: string): string {
        const textParts = token.split(":");
        const iv = Buffer.from(textParts.shift(), "hex");
        const encryptedText = Buffer.from(textParts.join(":"), "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(this.secret), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    abstract decode(token: string): T;

    abstract encode(payload: T): string;
}
