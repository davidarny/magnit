import { ApiModelProperty } from "@nestjs/swagger";
import { TaskStage } from "../entities/task-stage.entity";

export class StageHistoryDto {
    @ApiModelProperty({ description: "ISO date format" }) readonly date: string;
    @ApiModelProperty() readonly description: string;
    @ApiModelProperty({ type: TaskStage }) readonly stage: TaskStage;
}
