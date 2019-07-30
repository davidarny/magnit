import { SectionDto } from "./section.dto";
import { TTemplateType } from "../entities/template.entity";

export class TemplateDto {
    readonly id: number;
    readonly title: string;
    readonly description: string;
    readonly type: TTemplateType;
    readonly sections: SectionDto[];
}
