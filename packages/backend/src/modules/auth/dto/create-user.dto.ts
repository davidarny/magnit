import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { ConstructableDto } from "../../../shared/dto/constructable.dto";

export class CreateUserDTO<T = CreateUserDTO<object>> extends ConstructableDto<T> {
    @ApiModelProperty() readonly username: string;
    @ApiModelProperty() readonly password: string;
    @ApiModelProperty() readonly email: string;
}
