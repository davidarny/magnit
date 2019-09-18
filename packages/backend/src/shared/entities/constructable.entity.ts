import { DeepPartial } from "typeorm";

export abstract class ConstructableEntity<E, T = DeepPartial<E>> {
    protected construct?(self?: E, dto?: T) {
        if (self && dto) {
            Object.assign(self, dto);
        }
    }
}
