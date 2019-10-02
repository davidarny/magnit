import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class TaskStageDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<TaskStageDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly title: string;
    @ApiModelProperty() readonly finished: boolean;
    @ApiModelProperty({ description: "ISO date format" }) readonly deadline: string;
}
