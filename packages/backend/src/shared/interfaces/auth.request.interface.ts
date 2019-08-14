import { Request } from "express";
import { User } from "../../modules/auth/entities/user.entity";

export interface IAuthRequest extends Request {
    user: Omit<User, "password"> | null;
}
