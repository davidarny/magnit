import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class AuthResponse extends BaseResponse {
    @ApiModelProperty() readonly token: string;
    @ApiModelProperty() readonly id: string;
}
