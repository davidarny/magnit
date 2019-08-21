import { SectionDto } from "./section.dto";
import { TTemplateType } from "../entities/template.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class TemplateDto {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty({ type: [SectionDto] }) readonly sections: SectionDto[];
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
}
