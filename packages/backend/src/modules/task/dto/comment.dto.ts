import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class CommentDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<CommentDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly text: string;
    @ApiModelProperty() readonly id_user: string;
    @ApiModelProperty() readonly id_assignment: number;
}
