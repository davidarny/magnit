import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./services/user.service";
import { UserController } from "./user.controller";
import { UserRole } from "../auth/entities/user.role.entity";
import { User } from "../auth/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, UserRole])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule {}
