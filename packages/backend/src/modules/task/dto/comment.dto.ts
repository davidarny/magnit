import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class CommentDto extends PrimaryBaseDto<CommentDto> {
    @ApiModelProperty() readonly text: string;
    @ApiModelProperty() readonly id_user: number;
    @ApiModelProperty() readonly id_assignment: number;
}
