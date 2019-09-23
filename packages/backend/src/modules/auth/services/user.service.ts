import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserService } from "../interface/user.service.interface";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        console.log("asdsa ");
    }

    async findOne(username: String): Promise<User | undefined> {
        return await this.userRepository.findOne({ username: `$${username}` });
    }
}
