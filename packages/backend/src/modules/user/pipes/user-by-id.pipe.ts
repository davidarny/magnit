import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { UserNotFoundException } from "../../../shared/exceptions/user-not-found.exception";
import { UserService } from "../services/user.service";

@Injectable()
export class UserByIdPipe implements PipeTransform<number, Promise<number>> {
    constructor(private readonly userService: UserService) {}

    async transform(id: number, metadata: ArgumentMetadata): Promise<number> {
        if (!(await this.userExist(id))) {
            throw new UserNotFoundException(`User with id ${id} was not found`);
        }
        return id;
    }

    private async userExist(id: number) {
        return this.userService.userExistById(id);
    }
}
