import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class TaskDocumentDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<TaskDocumentDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly filename: string;
    @ApiModelPropertyOptional() readonly original_name: string;
}
