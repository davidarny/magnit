import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserService } from "../interface/user.service.interface";
import { User } from "../entities/user.entity";

@Injectable()
export class UserService implements IUserService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

    async findOne(username: String): Promise<User | undefined> {
        return await this.repository.findOne({ username: `$${username}` });
    }
}
