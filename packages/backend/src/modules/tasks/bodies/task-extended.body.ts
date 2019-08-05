import { TaskDto } from "../dto/task.dto";
import { ApiModelProperty } from "@nestjs/swagger";
import { TemplateDto } from "../../template/dto/template.dto";

export class TaskExtendedBody extends TaskDto {
    @ApiModelProperty({ type: [TemplateDto] }) readonly templates: TemplateDto[];
}
