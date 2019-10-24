import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class CommentDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly text: string;
    @ApiModelProperty() readonly id_user: string;
    @ApiModelProperty() readonly id_assignment: number;
}
