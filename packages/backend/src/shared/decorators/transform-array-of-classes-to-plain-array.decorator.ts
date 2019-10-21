import { ClassTransformer, ClassTransformOptions } from "class-transformer";

export function TransformArrayOfClassesToPlainArray(params?: ClassTransformOptions) {
    return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
        const classTransformer = new ClassTransformer();
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
                if (Array.isArray(result)) {
                    return data.map(item => classTransformer.classToPlain(item, params));
                } else {
                    return classTransformer.classToPlain(data, params);
                }
            } else {
                return classTransformer.classToPlain(result, params);
            }
        };
    };
}
