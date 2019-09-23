import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        console.log("asdsa ");
    }

    async findOne(username: String) {
        return this.userRepository.findOne({ username: `$${username}` });
    }

    async create(user: User) {
        try {
            var res = await this.userRepository.save(user);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err);
        }
    }
}
