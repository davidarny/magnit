import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";

export class BaseDto<T = BaseDto<object>> {
    constructor(dto?: DeepPartial<T>) {
        if (dto) {
            Object.assign(this, dto);
        }
    }

    @ApiModelProperty() readonly id: number;
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
