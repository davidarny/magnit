import { ApiModelProperty } from "@nestjs/swagger";
import { TemplateDto } from "../../template/dto/template.dto";
import { TTaskStatus } from "../entities/task.entity";
import { TaskStageDto } from "./task-stage.dto";

export class TaskDto {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed"] })
    readonly status: TTaskStatus;
    @ApiModelProperty({ description: "ISO date format" }) readonly created_at: string;
    @ApiModelProperty({ description: "ISO date format" }) readonly updated_at: string;
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
