import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "./base.dto";

export abstract class PrimaryBaseDto<T = PrimaryBaseDto<object>> extends BaseDto<T> {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
