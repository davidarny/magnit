import { ApiModelProperty } from "@nestjs/swagger";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class MarketplaceDto extends PrimaryBaseDto {
    @ApiModelProperty() readonly region: string;
    @ApiModelProperty() readonly city: string;
    @ApiModelProperty() readonly format: string;
    @ApiModelProperty() readonly address: string;
}
