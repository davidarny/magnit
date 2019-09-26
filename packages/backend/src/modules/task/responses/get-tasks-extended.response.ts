import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { TaskDto } from "../dto/task.dto";

export class TaskExtendedDto extends TaskDto<TaskExtendedDto> {
    // marketplace
    @ApiModelPropertyOptional() readonly address: string | null;
    @ApiModelPropertyOptional() readonly city: string | null;
    @ApiModelPropertyOptional() readonly format: string | null;
    @ApiModelPropertyOptional() readonly region: string | null;
    // stage
    @ApiModelPropertyOptional() readonly stage_title: string | null;
    @ApiModelPropertyOptional() readonly deadline: string | null;
}

export class GetTasksExtendedResponse extends BaseResponse {
    @ApiModelProperty({ type: [TaskExtendedDto] }) readonly tasks: TaskExtendedDto[];
}
