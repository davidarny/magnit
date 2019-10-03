import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { ShortTemplateDto, TemplateDto } from "../dto/template.dto";

export class GetTemplatesResponse extends BaseResponse {
    @ApiModelProperty() readonly total: number;
    @ApiModelProperty({ type: [ShortTemplateDto] }) readonly templates: ShortTemplateDto[];
}

export class GetTemplatesExtendedResponse extends BaseResponse {
    @ApiModelProperty() readonly total: number;
    @ApiModelProperty({ type: [TemplateDto] }) readonly templates: TemplateDto[];
}
