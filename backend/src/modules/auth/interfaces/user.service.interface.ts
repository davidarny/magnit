import { User } from "../entities/user.entity";

export interface IUserService {
    findOne(username: string): Promise<User | undefined>;

    findAll(): Promise<User[]>;
}
