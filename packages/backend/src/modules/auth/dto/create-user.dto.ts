import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { ConstructableDto } from "../../../shared/dto/constructable.dto";

export class CreateUserDto extends ConstructableDto {
    @IsString()
    @ApiModelProperty()
    readonly password: string;

    @IsString()
    @IsEmail()
    @ApiModelProperty()
    readonly email: string;

    @IsString()
    readonly firstName: string;

    @IsString()
    readonly lastName: string;
}
