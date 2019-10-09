import { IsEmail, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    readonly password: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;
}
