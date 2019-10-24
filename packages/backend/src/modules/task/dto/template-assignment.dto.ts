import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class TemplateAssignmentDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly editable: boolean;
}
