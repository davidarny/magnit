import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { DeepPartial } from "typeorm";
import { ConstructableEntity } from "../../../shared/entities/constructable.entity";

export class User extends ConstructableEntity {
    constructor(dto?: DeepPartial<User>) {
        super();
        this.construct(this, dto);
    }

    @IsString()
    username: string;

    @Exclude({ toPlainOnly: true })
    password: string;

    @IsString()
    id: string;

    @IsEmail()
    email: string;
}
