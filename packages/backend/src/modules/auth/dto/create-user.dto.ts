import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { ConstructableDto } from "../../../shared/dto/constructable.dto";

export class CreateUserDTO<T = CreateUserDTO<object>> extends ConstructableDto<T> {
    @IsString()
    @ApiModelProperty()
    readonly username: string;

    @IsString()
    @ApiModelProperty()
    readonly password: string;

    @IsString()
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;
}
