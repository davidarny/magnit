import { Request } from "express";
import { User } from "../../modules/user/entities/user.entity";

export interface IAuthRequest extends Request {
    user: User & {
        // push token
        tokens?: string[];
    };
}
