import { ApiModelProperty } from "@nestjs/swagger";

export class BaseDto {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
