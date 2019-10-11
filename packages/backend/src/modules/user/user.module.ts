import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./services/user.service";
import { UserController } from "./user.controller";
import { UserRole } from "./entities/user.role.entity";
import { User } from "./entities/user.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
import { RoleNotFoundException } from "../../shared/exceptions/role-not-found.exception";
import { AdminRoleNotAssignException } from "../../shared/exceptions/admin-role-not-assign.exception";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule implements NestModule {
    constructor(private readonly userService: UserService) {}

    async configure(consumer: MiddlewareConsumer) {
        const adminTitle = process.env.ADMIN_ROLE_TITLE;
        const description = process.env.ADMIN_ROLE_DESCRIPTION;
        const adminId = process.env.ADMIN_ROLE_ID;

        if (!adminTitle || !description || !adminId) {
            throw new AdminRoleNotAssignException("Admin role not assign");
        }
        const createRoleDto = new CreateRoleDto({
            id: +adminId,
            title: adminTitle,
            description: description,
        });
        const role = new UserRole(createRoleDto);

        try {
            await this.userService.getAdminRole();
        } catch (error) {
            if (error instanceof RoleNotFoundException) {
                this.userService.createRole(role);
            }
        }
    }
}
