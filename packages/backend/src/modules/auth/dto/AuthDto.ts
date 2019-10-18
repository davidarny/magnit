import { ApiModelProperty } from "@nestjs/swagger";

export class AuthDto {
    @ApiModelProperty() readonly username: string;
    @ApiModelProperty() readonly password: string;
}
