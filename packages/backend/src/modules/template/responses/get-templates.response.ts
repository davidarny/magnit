import { BaseResponse } from "./base.response";
import { ApiModelProperty } from "@nestjs/swagger";
import { TemplateDto } from "../dto/template.dto";

export class GetTemplatesResponse extends BaseResponse {
    @ApiModelProperty({ type: [TemplateDto] }) readonly templates: TemplateDto[];
}
