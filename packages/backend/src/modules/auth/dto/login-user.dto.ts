import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginUserDTO {
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

    @IsString()
    @ApiModelProperty()
    readonly password: string;
}
