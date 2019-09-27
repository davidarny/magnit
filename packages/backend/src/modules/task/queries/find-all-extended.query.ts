import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { FindAllQuery } from "./find-all.query";

export class FindAllQueryExtended extends FindAllQuery {
    @ApiModelPropertyOptional() readonly region?: string;
    @ApiModelPropertyOptional() readonly city?: string;
}
