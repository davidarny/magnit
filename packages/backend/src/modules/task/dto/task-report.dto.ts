import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TaskStageDto } from "./task-stage.dto";
import { TaskDto } from "./task.dto";

export class ReportTemplateDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly version: number;
    @ApiModelProperty() readonly title: string;
}

export class ReportStageDto extends TaskStageDto {
    @ApiModelProperty({ type: [ReportTemplateDto] }) readonly templates: ReportTemplateDto[];
}

export class TaskReportDto extends TaskDto {
    @ApiModelProperty({ type: [ReportStageDto] }) readonly stages: ReportStageDto[];
}
