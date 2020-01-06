import { ApiModelProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { ConstructableEntity } from "../../../shared/entities/constructable.entity";

export class User extends ConstructableEntity {
    @IsString()
    @ApiModelProperty()
    username: string;

    @IsString()
    @ApiModelProperty()
    id: string;

    @IsEmail()
    @ApiModelProperty()
    email: string;

    @IsString()
    @ApiModelProperty()
    firstName: string;

    @IsString()
    @ApiModelProperty()
    lastName: string;
}
