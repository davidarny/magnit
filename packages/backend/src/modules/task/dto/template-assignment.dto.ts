import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class TemplateAssignmentDto extends PrimaryBaseDto<TemplateAssignmentDto> {
    @ApiModelProperty() readonly editable: boolean;
}
