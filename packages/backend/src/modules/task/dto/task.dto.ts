import { ApiModelProperty } from "@nestjs/swagger";
import { TemplateDto } from "../../template/dto/template.dto";
import { TTaskStatus } from "../entities/task.entity";

export class TaskDto {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly name: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed"] })
    readonly status: TTaskStatus;
}

export class TaskWithTemplatesDto extends TaskDto {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
}

export class TaskToTemplateDto {
    @ApiModelProperty() readonly editable: boolean;
}

class EditableTemplateDto extends TemplateDto {
    @ApiModelProperty() readonly editable: boolean;
}

export class TaskWithTemplatesExtendedDto extends TaskDto {
    @ApiModelProperty({ type: [EditableTemplateDto] }) readonly templates: EditableTemplateDto[];
}
