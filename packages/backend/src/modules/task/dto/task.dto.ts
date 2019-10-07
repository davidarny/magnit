import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { MarketplaceDto } from "../../marketplace/dto/marketplace.dto";
import { TemplateAnswerDto } from "../../template/dto/template-answer.dto";
import { TemplateDto } from "../../template/dto/template.dto";
import { ETaskStatus } from "../entities/task.entity";
import { CommentDto } from "./comment.dto";
import { TaskDocumentDto } from "./task-document.dto";
import { TaskStageDto } from "./task-stage.dto";

export class TaskDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<TaskDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly title: string;
    @ApiModelPropertyOptional() readonly description: string;
    @ApiModelPropertyOptional() readonly id_owner: number;
    @ApiModelPropertyOptional() readonly id_assignee: number;
    @ApiModelPropertyOptional() readonly id_marketplace: number;
    @ApiModelProperty({ default: 3 }) readonly notify_before: number;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed", "expired"] })
    readonly status: ETaskStatus;
}

export class FullTaskDto extends TaskDto {
    constructor(dto?: DeepPartial<FullTaskDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
    @ApiModelPropertyOptional({ type: MarketplaceDto }) readonly marketplace: MarketplaceDto | null;
}

class ExtendedTemplateDto extends TemplateDto {
    constructor(dto?: DeepPartial<ExtendedTemplateDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly editable: boolean;
    @ApiModelProperty({ type: [TemplateAnswerDto] }) readonly answers: TemplateAnswerDto[];
    @ApiModelProperty({ type: [CommentDto] }) readonly comments: CommentDto[];
}

export class ExtendedTaskDto extends TaskDto {
    constructor(dto?: DeepPartial<ExtendedTaskDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty({ type: [ExtendedTemplateDto] }) readonly templates: ExtendedTemplateDto[];
    @ApiModelProperty({ type: [TaskStageDto] }) readonly stages: TaskStageDto[];
    @ApiModelProperty({ type: [TaskDocumentDto] }) readonly documents: TaskDocumentDto[];
    @ApiModelPropertyOptional({ type: MarketplaceDto }) readonly marketplace: MarketplaceDto | null;
}
