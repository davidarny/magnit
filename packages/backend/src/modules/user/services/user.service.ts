import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../..//auth/entities/user.entity";
import { Repository, FindManyOptions } from "typeorm";
import { UserRole } from "../../auth/entities/user.role.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) {}

    async findById(id: number) {
        return this.userRepository.findOne({
            where: { id: id },
        });
    }

    async findOneByEmail(email: string) {
        return this.userRepository.findOne({ email: `${email}` });
    }

    async findAll(role?: number) {
        const options: FindManyOptions<User> = {};
        if (typeof role !== "undefined") {
        }
    }

    async create(user: User) {
        console.log(user);
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }
}
