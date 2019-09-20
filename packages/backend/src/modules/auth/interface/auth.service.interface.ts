import { User } from "../entities/user.entity";

export interface IAuthService {
    validateUser(username: string, pass: string): Promise<User | undefined>;
}
