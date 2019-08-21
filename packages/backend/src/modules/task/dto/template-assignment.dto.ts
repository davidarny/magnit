import { ApiModelProperty } from "@nestjs/swagger";

export class TemplateAssignmentDto {
    @ApiModelProperty() readonly editable: boolean;
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
