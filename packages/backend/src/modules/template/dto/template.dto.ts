import { BaseDto } from "../../../shared/dto/base.dto";
import { SectionDto } from "./section.dto";
import { TTemplateType } from "../entities/template.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class TemplateDto<T = TemplateDto<object>> extends BaseDto<TemplateDto> {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty({ type: [SectionDto] }) readonly sections: SectionDto[];
    @ApiModelProperty() readonly version: number;
}
