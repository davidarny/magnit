import { ApiModelProperty } from "@nestjs/swagger";

export class ErrorResponse {
    @ApiModelProperty() readonly error: string;
    @ApiModelProperty() readonly message: string;
    @ApiModelProperty() readonly statusCode: number;
}
