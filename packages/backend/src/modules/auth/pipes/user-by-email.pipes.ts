import { PipeTransform, Injectable, Inject, ArgumentMetadata } from "@nestjs/common";
import { LoginUserDTO } from "../dto/login-user.dto";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class UserByEmailPipe implements PipeTransform {
    constructor(@Inject(UserService) private readonly userService: UserService) {}

    transform(loginUserDTO: LoginUserDTO, metadata: ArgumentMetadata) {
        return this.userService.findOneByEmail(loginUserDTO.email);
    }
}
