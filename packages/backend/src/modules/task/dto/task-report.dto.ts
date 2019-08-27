import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";
import { TaskStageDto } from "./task-stage.dto";
import { TaskDto } from "./task.dto";

export class ReportTemplateDto extends BaseDto<ReportTemplateDto> {
    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly version: number;
}

export class ReportStageDto extends TaskStageDto<ReportStageDto> {
    @ApiModelProperty({ type: [ReportTemplateDto] }) readonly templates: ReportTemplateDto[];
}

export class TaskReportDto extends TaskDto<TaskReportDto> {
    @ApiModelProperty({ type: [ReportStageDto] }) readonly stages: ReportStageDto[];
}
