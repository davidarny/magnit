export abstract class ConstructableDto {
    constructor(dto?: unknown) {
        if (dto) {
            Object.assign(this, dto);
        }
    }
}
