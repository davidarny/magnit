import { ApiModelProperty } from "@nestjs/swagger";

export class AddTemplatesBody {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
}
