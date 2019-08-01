import { ApiModelProperty } from "@nestjs/swagger";

export class BaseResponse {
    @ApiModelProperty() readonly status: number;
}
