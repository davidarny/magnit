import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TTemplateType } from "../entities/template.entity";
import { SectionDto } from "./section.dto";

export class ShortTemplateDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty() readonly version: number;
}

export class TemplateDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["light", "complex"] })
    readonly type: TTemplateType;
    @ApiModelProperty({ type: [SectionDto] }) readonly sections: SectionDto[];
    @ApiModelProperty() readonly version: number;
}
