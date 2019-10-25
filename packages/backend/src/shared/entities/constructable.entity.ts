export abstract class ConstructableEntity {
    constructor(dto?: unknown) {
        if (dto) {
            Object.assign(this, dto);
        }
    }
}
