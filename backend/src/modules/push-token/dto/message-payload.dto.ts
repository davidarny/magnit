import { ApiModelPropertyOptional } from "@nestjs/swagger";

export class MessagePayloadDto {
    @ApiModelPropertyOptional() readonly body?: string;
    @ApiModelPropertyOptional() readonly title?: string;
}
