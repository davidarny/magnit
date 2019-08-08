import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";

export class UploadFileResponse extends BaseResponse {
    @ApiModelProperty() readonly filename: string;
}
