import { ApiModelProperty } from "@nestjs/swagger";
import { BaseDto } from "../../../shared/dto/base.dto";

export class TemplateAssignmentDto extends BaseDto<TemplateAssignmentDto> {
    @ApiModelProperty() readonly editable: boolean;
}
