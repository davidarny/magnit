import { PipeTransform, Injectable, Inject, ArgumentMetadata } from "@nestjs/common";
import { LoginUserDto } from "../dto/login-user.dto";
import { UserService } from "../../user/services/user.service";
import { User } from "../entities/user.entity";

@Injectable()
export class UserByEmailPipe implements PipeTransform<LoginUserDto, Promise<User>> {
    constructor(private readonly userService: UserService) {
        console.log("pipe");
    }

    async transform(loginUserDTO: LoginUserDto, metadata: ArgumentMetadata): Promise<User> {
        console.log(loginUserDTO);
        const res = await this.userService.findOneByEmail(loginUserDTO.email);
        console.log("res= ");
        console.log(res);
        return res;
    }
}
