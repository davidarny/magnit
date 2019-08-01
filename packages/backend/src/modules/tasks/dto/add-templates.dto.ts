import { ApiModelProperty } from "@nestjs/swagger";

export class AddTemplatesDto {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
}
