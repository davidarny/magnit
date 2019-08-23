import { BaseDto } from "../../../shared/dto/base.dto";
import { SectionDto } from "./section.dto";
import { TTemplateType } from "../entities/template.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class TemplateDto extends BaseDto {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty({ type: [SectionDto] }) readonly sections: SectionDto[];
}
