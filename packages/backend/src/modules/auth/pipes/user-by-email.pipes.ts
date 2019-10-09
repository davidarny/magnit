import { PipeTransform, Injectable, Inject, ArgumentMetadata } from "@nestjs/common";
import { UserUnauthorizedException } from "../../../shared/exceptions/user-unauthorized.exception";
import { LoginUserDto } from "../dto/login-user.dto";
import { UserService } from "../../user/services/user.service";

@Injectable()
export class UserByEmailPipe implements PipeTransform<any> {
    constructor(private readonly userService: UserService) {}

    async transform(loginUserDTO: LoginUserDto, metadata: ArgumentMetadata): Promise<Boolean> {
        const user = await this.userService.findOneByEmail(loginUserDTO.email);

        if (user) {
            return true;
        } else {
            throw new UserUnauthorizedException("User not found");
        }
    }
}
