export abstract class ConstructableEntity {
    protected construct?(self?: unknown, dto?: unknown) {
        if (self && dto) {
            Object.assign(self, dto);
        }
    }
}
