import { ApiModelProperty } from "@nestjs/swagger";
import { DeepPartial } from "typeorm";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class MarketplaceDto extends PrimaryBaseDto {
    constructor(dto?: DeepPartial<MarketplaceDto>) {
        super();
        this.construct(this, dto);
    }

    @ApiModelProperty() readonly region: string;
    @ApiModelProperty() readonly city: string;
    @ApiModelProperty() readonly format: string;
    @ApiModelProperty() readonly address: string;
}
