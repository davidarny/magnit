import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

interface IIndexedObject {
    [key: string]: any;
}

export class NoUndefPropsPipe<T extends IIndexedObject> implements PipeTransform<T, T> {
    constructor(private readonly keys: Array<keyof T>) {}

    transform(value: T, metadata: ArgumentMetadata): T {
        const errored: string[] = [];
        for (const key of Object.keys(value)) {
            if (!this.keys.includes(key)) {
                throw new BadRequestException(`Key "${key}" not found`);
            }
        }
        for (const key of this.keys) {
            if (typeof value[key] === "undefined") {
                errored.push(key.toString());
            }
        }
        if (errored.length > 0) {
            throw new BadRequestException(`[${errored.join(", ")}] should not be undefined`);
        }
        return value;
    }
}
