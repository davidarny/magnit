import { SectionDto } from "./section.dto";
import { TTemplateType } from "../../../shared/entities/template.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class TemplateDto {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty({ type: [SectionDto] }) readonly sections: SectionDto[];
}
