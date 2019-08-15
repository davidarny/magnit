import { Exclude } from "class-transformer";
import { IsString } from "class-validator";

export class User {
    constructor(user?: Partial<User>) {
        if (user) {
            Object.assign(this, user);
        }
    }

    @IsString()
    readonly username: string;

    @Exclude({ toPlainOnly: true })
    readonly password: string;
}
