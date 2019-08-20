interface IConstructor {
    new (...args: any[]): {};
}

export function EntityConstructor<T extends IConstructor>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(args);
            if (!args || !Array.isArray(args)) {
                return;
            }
            const dto = args[0];
            if (dto) {
                Object.assign(this, dto);
            }
        }
    };
}
