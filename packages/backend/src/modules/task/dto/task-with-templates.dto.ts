import { TaskDto } from "./task.dto";
import { ApiModelProperty } from "@nestjs/swagger";

export class TaskWithTemplatesDto extends TaskDto {
    @ApiModelProperty({ type: [Number] }) readonly templates: number[];
}
