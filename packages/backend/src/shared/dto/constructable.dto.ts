import { DeepPartial } from "typeorm";

export abstract class ConstructableDto<T = ConstructableDto<object>> {
    constructor(dto?: DeepPartial<T>) {
        if (dto) {
            Object.assign(this, dto);
        }
    }
}
