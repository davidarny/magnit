import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { TemplateDto } from "../dto/template.dto";

export class FindAllQuery {
    @ApiModelPropertyOptional({ default: 0, minimum: 0 }) readonly offset: number = 0;
    @ApiModelPropertyOptional({ default: 10, minimum: 0 })
    readonly limit: number = 10;
    @ApiModelPropertyOptional({ default: "ASC", enum: ["ASC", "DESC"] })
    readonly sort: "ASC" | "DESC" = "ASC";
    @ApiModelPropertyOptional({ description: "TemplateDto keys", default: "title", type: String })
    readonly sortBy?: keyof TemplateDto = "title";
    @ApiModelPropertyOptional({ description: "Query by name" }) readonly title?: string;
}
