import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";
import { TemplateDto } from "../../template/dto/template.dto";
import { ETaskStatus } from "../entities/task.entity";
import { TaskStageDto } from "./task-stage.dto";

export class TaskDto extends BaseDto {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed"] })
    readonly status: ETaskStatus;
}

export class FullTaskDto extends TaskDto {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
    @ApiModelProperty({ type: [Number] }) readonly stages: number[];
}

class EditableTemplateDto extends TemplateDto {
    @ApiModelProperty() readonly editable: boolean;
}

export class ExtendedTaskDto extends TaskDto {
    @ApiModelProperty({ type: [EditableTemplateDto] }) readonly templates: EditableTemplateDto[];
    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
}
