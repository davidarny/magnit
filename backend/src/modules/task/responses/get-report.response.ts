import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { TaskReportDto } from "../dto/task-report.dto";

export class GetReportResponse extends BaseResponse {
    @ApiModelProperty({ type: TaskReportDto }) readonly report: TaskReportDto;
}
