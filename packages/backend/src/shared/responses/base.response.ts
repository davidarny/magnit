import { ApiModelProperty } from "@nestjs/swagger";

export class BaseResponse {
    @ApiModelProperty({ enum: [0, 1] }) readonly success: 0 | 1;
}
