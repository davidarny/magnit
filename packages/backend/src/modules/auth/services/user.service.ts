import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findOne(username: String) {
        return this.userRepository.findOne({ username: `${username}` });
    }

    async findOneByEmail(email: string) {
        return this.userRepository.findOne({ email: `${email}` });
    }

    async create(user: User) {
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }
}
