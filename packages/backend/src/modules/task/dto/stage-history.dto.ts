import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { TaskStageDto } from "./task-stage.dto";

export class StageHistoryDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<StageHistoryDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly description: string;
}

export class FullStageHistoryDto extends StageHistoryDto {
    constructor(dto?: DeepPartial<FullStageHistoryDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty({ type: TaskStageDto }) readonly stage: TaskStageDto;
}
