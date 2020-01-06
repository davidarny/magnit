import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { TaskExtendedDto } from "../responses/get-tasks-extended.response";
import { FindAllQuery } from "./find-all.query";

export class FindAllQueryExtended extends FindAllQuery<TaskExtendedDto> {
    @ApiModelPropertyOptional() readonly region?: string;
    @ApiModelPropertyOptional() readonly city?: string;
}
