import { ApiModelProperty } from "@nestjs/swagger";
import { TTaskStatus } from "../entities/task.entity";

export class TaskDto {
    @ApiModelProperty() readonly name: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ enum: ["in_progress", "on_check", "draft", "completed"] })
    readonly status: TTaskStatus;
}
