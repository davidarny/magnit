import { Request } from "express";
import { User } from "../../modules/auth/entities/user.entity";

export interface IAuthRequest extends Request {
    user: User & {
        // push token
        token?: string;
    };
}
