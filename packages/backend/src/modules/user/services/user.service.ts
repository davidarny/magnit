import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { Repository, FindManyOptions } from "typeorm";
import { UserRole } from "../entities/user.role.entity";
import { RoleNotFoundException } from "../../../shared/exceptions/role-not-found.exception";
import { CreateRoleDto } from "../dto/create-role.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) {}

    async findById(id: number) {
        const user = await this.userRepository.findOne({
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
        return this.userRepository.save(user);
    }

    async findRoleById(roleId: number) {
        return this.userRoleRepository.findOne({
            where: { id: roleId },
        });
    }

    async roleByIdExists(role: UserRole) {
        return this.userRoleRepository.hasId(role);
    }

    async getAdminRole() {
        const role = await this.userRoleRepository.findOne({
            where: { isAdmin: true },
        });
        if (role) {
            return role;
        } else {
            throw new RoleNotFoundException("Admin role not found");
        }
    }

    async createRole(role: UserRole) {
        return this.userRoleRepository.save(role);
    }
}
