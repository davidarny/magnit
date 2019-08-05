import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

interface IIndexedObject {
    [key: string]: any;
}

@Injectable()
export class NonCompatiblePropsPipe<T extends IIndexedObject> implements PipeTransform<T, T> {
    constructor(private readonly keys: Array<keyof T>) {}

    transform(value: T, metadata: ArgumentMetadata): T {
        const present = new Map<string | number | symbol, boolean>();
        for (const key of Object.keys(value)) {
            if (!this.keys.includes(key)) {
                throw new BadRequestException(`Key "${key}" not found`);
            }
        }
        for (const key of this.keys) {
            present.set(key, !!value[key]);
        }
        if ([...present.values()].every(bool => bool)) {
            throw new BadRequestException(
                `Found non compatible props in [${[...present.keys()].join(", ")}]`,
            );
        }
        return value;
    }
}
