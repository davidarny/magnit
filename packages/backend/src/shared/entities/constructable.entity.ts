import { DeepPartial } from "typeorm";

export abstract class ConstructableEntity<E, T = DeepPartial<E>> {
    protected construct?(entity?: E, dto?: T) {
        if (entity && dto) {
            Object.assign(entity, dto);
        }
    }
}
