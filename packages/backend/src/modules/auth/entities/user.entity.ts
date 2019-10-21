import { ApiModelProperty } from "@nestjs/swagger";
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
    @ApiModelProperty()
    username: string;

    @Exclude({ toPlainOnly: true })
    password: string;

    @IsString()
    @ApiModelProperty()
    id: string;

    @IsEmail()
    @ApiModelProperty()
    email: string;
}
