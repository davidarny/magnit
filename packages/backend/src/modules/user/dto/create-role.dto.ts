import { IsString, IsNumber } from "class-validator";
import { ConstructableDto } from "../../../shared/dto/constructable.dto";
import { DeepPartial } from "typeorm";

export class CreateRoleDto extends ConstructableDto {
    constructor(dto?: DeepPartial<CreateRoleDto>) {
        super();
        this.construct(this, dto);
    }

    @IsNumber()
    readonly id: number;

    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;
}
