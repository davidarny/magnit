import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { NonCompatiblePropsException } from "../exceptions/non-compatible-props.exception";

interface IIndexedObject {
    [key: string]: any;
}

@Injectable()
export class NonCompatiblePropsPipe<T extends IIndexedObject> implements PipeTransform<T, T> {
    constructor(private readonly keys: Array<keyof T>) {}

    transform(value: T, metadata: ArgumentMetadata): T {
        const present = new Map<string | number | symbol, boolean>();
        for (const key of this.keys) {
            present.set(key, !!value[key]);
        }
        if ([...present.values()].every(bool => bool)) {
            throw new NonCompatiblePropsException(
                `Found non compatible props in [${[...present.keys()].join(", ")}]`,
            );
        }
        return value;
    }
}
