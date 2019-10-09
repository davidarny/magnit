import { IsString, IsBoolean, IsNumber } from "class-validator";
import { PrimaryBaseDto } from "../../../shared/dto/primary-base.dto";

export class CreateRoleDto {
    constructor(title: string, description: string, isAdmin: boolean) {
        this.title = title;
        this.description = description;
        this.isAdmin = isAdmin;
    }

    @IsString()
    readonly title: string;

    @IsString()
    readonly description: string;

    @IsBoolean()
    readonly isAdmin: boolean;
}
