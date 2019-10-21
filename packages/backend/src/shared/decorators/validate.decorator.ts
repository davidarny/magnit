import { validate } from "class-validator";

export function Validate(Exception?: new (...args: any[]) => any) {
    return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function() {
            const args = [];
            for (let i = 0; i < arguments.length; i++) {
                args[i] = arguments[i];
            }
            const result = originalMethod.apply(this, args);
            const isPromise =
                !!result &&
                (typeof result === "object" || typeof result === "function") &&
                typeof result.then === "function";
            if (isPromise) {
                const data = await result;
                if (Array.isArray(data)) {
                    for (const item of data) {
                        const errors = await validate(item, { validationError: { target: false } });
                        if (errors.length > 0) {
                            throw new Exception(errors);
                        }
                    }
                } else {
                    const errors = await validate(data, { validationError: { target: false } });
                    if (errors.length > 0) {
                        throw new Exception(errors);
                    }
                }
                return result;
            } else {
                if (Array.isArray(result)) {
                    for (const item of result) {
                        const errors = await validate(item, {
                            validationError: { target: false },
                        });
                        if (errors.length > 0) {
                            throw new Exception(errors);
                        }
                    }
                } else {
                    const errors = await validate(result, { validationError: { target: false } });
                    if (errors.length > 0) {
                        throw new Exception(errors);
                    }
                }
                return result;
            }
        };
    };
}
