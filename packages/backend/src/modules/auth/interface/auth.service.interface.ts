import { User } from "../entities/user.entity";
import { CreateUserDTO } from "../dto/create-user.dto";

export interface IAuthService {
    validateUser(username: string, pass: string): Promise<User | undefined>;
    createUser(createUserDTO: CreateUserDTO): Promise<User>;
}
