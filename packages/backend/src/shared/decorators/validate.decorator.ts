import { validate } from "class-validator";

export function Validate(target?: boolean, Exception?: { new (...args: any[]): any }) {
    return function(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
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
                const errors = await validate(data, { validationError: { target } });
                if (errors.length > 0) {
                    throw new Exception(errors);
                }
                return result;
            } else {
                const errors = await validate(result, { validationError: { target } });
                if (errors.length > 0) {
                    throw new Exception(errors);
                }
                return result;
            }
        };
    };
}
