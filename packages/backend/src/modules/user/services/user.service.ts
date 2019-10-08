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
        const { id_role, ...user } = await this.userRepository.findOne({
            where: { id: id },
            relations: ["role"],
        });
        return user;
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
        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }

    async findRole(roleId: number) {
        return this.userRoleRepository.findOne({
            where: { id: roleId },
        });
    }

    async getDefaultRole() {
        const defaultRoleId = 0;
        const existRole = await this.findRole(defaultRoleId);

        if (existRole) {
            return existRole;
        } else {
            const savedRole = await this.userRoleRepository.query(
                `INSERT INTO user_role ("created_at","updated_at","id","title","description") VALUES (DEFAULT,DEFAULT,'0','admine role','admine role')`,
            );
            return savedRole;
        }
    }
}
