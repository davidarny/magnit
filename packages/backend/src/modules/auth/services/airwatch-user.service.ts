import { IUserService } from "../interfaces/user.service.interface";
import { Injectable } from "@nestjs/common";
import { User } from "../entities/user.entity";

@Injectable()
export class AirwatchUserService implements IUserService {
    async findOne(username: string): Promise<User | undefined> {
        // TODO: find user in airwatch
        return undefined;
    }
}
