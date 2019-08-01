import { ApiModelProperty } from "@nestjs/swagger";
import { TemplateDto } from "../dto/template.dto";
import { BaseResponse } from "../../../shared/base.response";

export class GetTemplatesResponse extends BaseResponse {
    @ApiModelProperty() readonly total: number;
    @ApiModelProperty({ type: [TemplateDto] }) readonly templates: TemplateDto[];
}
