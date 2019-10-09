import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./services/user.service";
import { UserController } from "./user.controller";
import { UserRole } from "./entities/user.role.entity";
import { User } from "./entities/user.entity";
import { CreateRoleDto } from "./dto/create-role.dto";
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
        const admineTitle = process.env.ADMIN_ROLE_TITLE || "Admine role title";
        const description = process.env.ADMIN_ROLE_DESCRIPTION || "Admine role description";
        const createRoleDto = new CreateRoleDto(admineTitle, description, true);
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
