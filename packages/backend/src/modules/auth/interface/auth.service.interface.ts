import { User } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";

export interface IAuthService {
    validateUser(username: string, pass: string): Promise<User | undefined>;
    createUser(createUserDTO: CreateUserDto): Promise<User>;
}
