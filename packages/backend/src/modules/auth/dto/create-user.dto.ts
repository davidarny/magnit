import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class CreateUserDTO<T = CreateUserDTO<object>> extends PrimaryBaseDto<T> {
    @ApiModelProperty() readonly username: String;
    @ApiModelProperty() readonly password: String;
    @ApiModelProperty() readonly email: String;
}
