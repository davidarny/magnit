import { User } from "../entities/user.entity";

export interface IAuthService {
    validateUser(username: string, password: string): Promise<User | undefined>;
}
