import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { BaseResponse } from "../../../shared/responses/base.response";
import { TaskDto } from "../dto/task.dto";

export class TaskExtendedDto extends TaskDto {
    constructor(dto?: DeepPartial<TaskExtendedDto>) {
        super();
        this.construct(this, dto);
    }

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
    @ApiModelProperty({ description: "Total per status" }) readonly total: number;
    @ApiModelProperty({ description: "Total" }) readonly all: number;
    @ApiModelProperty({ type: [TaskExtendedDto] }) readonly tasks: TaskExtendedDto[];
}
