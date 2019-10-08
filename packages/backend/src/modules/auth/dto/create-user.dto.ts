import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    constructor(password: string, email: string, firstName: string, lastName: string) {}

    @IsString()
    @ApiModelProperty()
    readonly password: string;

    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;
}
