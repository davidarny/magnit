import { TaskDto } from "./task.dto";
import { ApiModelProperty } from "@nestjs/swagger";
import { TemplateDto } from "../../template/dto/template.dto";

export class TaskExtendedDto extends TaskDto {
    @ApiModelProperty({ type: [TemplateDto] }) readonly templates: TemplateDto[];
}
