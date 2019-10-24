import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { TaskExtendedDto } from "../responses/get-tasks-extended.response";
import { FindAllQuery } from "./find-all.query";

export class FindAllQueryExtended extends FindAllQuery<TaskExtendedDto> {
    constructor(dto?: DeepPartial<FindAllQueryExtended>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelPropertyOptional() readonly region?: string;

    @ApiModelPropertyOptional() readonly city?: string;
}
