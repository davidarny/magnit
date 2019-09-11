import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TemplateAnswerDto } from "../../template/dto/template-answer.dto";
import { TemplateDto } from "../../template/dto/template.dto";
import { ETaskStatus } from "../entities/task.entity";
import { TaskStageDto } from "./task-stage.dto";

export class TaskDto<T = TaskDto<object>> extends PrimaryBaseDto<T> {
    @ApiModelProperty() readonly title: string;
    @ApiModelProperty({ nullable: true }) readonly description: string;
    @ApiModelProperty({ nullable: true }) readonly id_owner: string;
    @ApiModelProperty({ nullable: true }) readonly id_assignee: string;
    @ApiModelProperty({ default: 3 }) readonly notify_before: number;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed", "expired"] })
    readonly status: ETaskStatus;
}

export class FullTaskDto extends TaskDto<FullTaskDto> {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
    @ApiModelProperty({ type: [Number] }) readonly stages: number[];
}

class EditableTemplateDto extends TemplateDto<EditableTemplateDto> {
    @ApiModelProperty() readonly editable: boolean;
    @ApiModelProperty({ type: [TemplateAnswerDto] }) readonly answers: TemplateAnswerDto[];
}

export class ExtendedTaskDto extends TaskDto<ExtendedTaskDto> {
    @ApiModelProperty({ type: [EditableTemplateDto] }) readonly templates: EditableTemplateDto[];
    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
}
