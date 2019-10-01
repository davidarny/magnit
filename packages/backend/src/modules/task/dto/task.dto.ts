import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { MarketplaceDto } from "../../marketplace/dto/marketplace.dto";
import { TemplateAnswerDto } from "../../template/dto/template-answer.dto";
import { TemplateDto } from "../../template/dto/template.dto";
import { ETaskStatus } from "../entities/task.entity";
import { CommentDto } from "./comment.dto";
import { TaskDocumentDto } from "./task-document.dto";
import { TaskStageDto } from "./task-stage.dto";

export class TaskDto<T = TaskDto<object>> extends PrimaryBaseDto<T> {
    @ApiModelProperty() readonly title: string;
    @ApiModelPropertyOptional() readonly description: string;
    @ApiModelPropertyOptional() readonly id_owner: string;
    @ApiModelPropertyOptional() readonly id_assignee: string;
    @ApiModelPropertyOptional() readonly id_marketplace: number;
    @ApiModelProperty({ default: 3 }) readonly notify_before: number;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed", "expired"] })
    readonly status: ETaskStatus;
}

export class FullTaskDto extends TaskDto<FullTaskDto> {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
    @ApiModelProperty({ type: [Number] }) readonly documents: number[];
    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
    @ApiModelPropertyOptional({ type: MarketplaceDto }) readonly marketplace: MarketplaceDto | null;
}

class ExtendedTemplateDto extends TemplateDto<ExtendedTemplateDto> {
    @ApiModelProperty() readonly editable: boolean;
    @ApiModelProperty({ type: [TemplateAnswerDto] }) readonly answers: TemplateAnswerDto[];
    @ApiModelProperty({ type: [CommentDto] }) readonly comments: CommentDto[];
}

export class ExtendedTaskDto extends TaskDto<ExtendedTaskDto> {
    @ApiModelProperty({ type: [ExtendedTemplateDto] }) readonly templates: ExtendedTemplateDto[];
    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
    @ApiModelProperty({ type: [TaskDocumentDto] }) readonly documents: TaskDocumentDto[];
    @ApiModelPropertyOptional({ type: MarketplaceDto }) readonly marketplace: MarketplaceDto | null;
}
