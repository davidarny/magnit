import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./services/user.service";
import { UserController } from "./user.controller";
import { UserRole } from "./entities/user.role.entity";
import { User } from "./entities/user.entity";
import { RoleNotFoundException } from "../../shared/exceptions/role-not-found.exception";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule implements NestModule {
    constructor(private readonly userService: UserService) {}

    async configure(consumer: MiddlewareConsumer) {
        const adminRoleTitle = process.env.ADMIN_ROLE_TITLE;
        const adminRoleDescription = process.env.ADMIN_ROLE_DESCRIPTION;
        const adminRoleId = process.env.ADMIN_ROLE_ID;

        if (!adminRoleTitle) {
            throw new Error("Admin role title is undefined");
        }

        if (!adminRoleDescription) {
            throw new Error("Admin role description is undefined");
        }

        if (!adminRoleId) {
            throw new Error("Admin role id is undefined");
        }

        const role = new UserRole({
            id: +adminRoleId,
            title: adminRoleTitle,
            description: adminRoleDescription,
        });

        try {
            await this.userService.getAdminRole();
        } catch (error) {
            if (error instanceof RoleNotFoundException) {
                this.userService.createRole(role);
            }
        }
    }
}
