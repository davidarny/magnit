import { ApiModelProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiModelProperty() readonly username: string;
    @ApiModelProperty() readonly password: string;
}
