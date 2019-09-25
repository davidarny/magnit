import * as crypto from "crypto";

export abstract class CryptManager<T> {
    // for AES, this is always 16
    private static readonly IV_LENGTH = 16;

    // must be 256 bits (32 characters)
    protected readonly secret = process.env.AUTH_SECRET;

    constructor() {
        if (process.env.NODE_ENV !== "testing" && !this.secret) {
            throw new Error("Auth secret is undefined");
        }
    }

    protected encrypt(payload: string): string {
        const iv = crypto.randomBytes(CryptManager.IV_LENGTH);
        const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(this.secret), iv);
        let encrypted = cipher.update(payload);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }

    protected decrypt(cryptValue: string): string {
        const textParts = cryptValue.split(":");
        const iv = Buffer.from(textParts.shift(), "hex");
        const encryptedText = Buffer.from(textParts.join(":"), "hex");
        const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(this.secret), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
