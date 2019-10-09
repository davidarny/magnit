import { IsEmail, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    readonly password: string;
}
