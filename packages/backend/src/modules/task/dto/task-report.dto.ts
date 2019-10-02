import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TaskStageDto } from "./task-stage.dto";
import { TaskDto } from "./task.dto";

export class ReportTemplateDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<ReportTemplateDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly id: number;
    @ApiModelProperty() readonly version: number;
    @ApiModelProperty() readonly title: string;
}

export class ReportStageDto extends TaskStageDto {
    constructor(dto?: DeepPartial<ReportStageDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty({ type: [ReportTemplateDto] }) readonly templates: ReportTemplateDto[];
}

export class TaskReportDto extends TaskDto {
    constructor(dto?: DeepPartial<TaskReportDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty({ type: [ReportStageDto] }) readonly stages: ReportStageDto[];
}
