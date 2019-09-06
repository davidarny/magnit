import { ApiModelPropertyOptional } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";
import { ENoLocationReason } from "../entities/template-answer-location.entity";

export class TemplateAnswerLocationDto extends PrimaryBaseDto<TemplateAnswerLocationDto> {
    @ApiModelPropertyOptional({ example: "gps" }) readonly provider: string | null;
    @ApiModelPropertyOptional() readonly latitude: number | null;
    @ApiModelPropertyOptional() readonly longitude: number | null;
    @ApiModelPropertyOptional() readonly altitude: number | null;
    @ApiModelPropertyOptional() readonly horizontal_accuracy_meters: number | null;
    @ApiModelPropertyOptional() readonly vertical_accuracy_meters: number | null;
    @ApiModelPropertyOptional({
        enum: [0, 1],
        description: "0 - LOCATION_DISABLED 1- LOCATION_NOT_DETERMINED",
    })
    readonly no_location_reason: ENoLocationReason | null;
}
