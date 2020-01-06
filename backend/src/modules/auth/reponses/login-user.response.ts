import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class LoginUserResponse extends BaseResponse {
    @ApiModelProperty() readonly token: string;
}
