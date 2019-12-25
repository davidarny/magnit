import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

interface IIndexedObject {
    [key: string]: any;
}

export class SplitPropPipe<T extends IIndexedObject> implements PipeTransform<T, T> {
    constructor(private readonly key: keyof T, private readonly splitter: string = ",") {}

    transform(value: T, metadata: ArgumentMetadata): T {
        if (typeof value[this.key] === "undefined") {
            return value;
        }
        value[this.key] = value[this.key].split(this.splitter);
        return value;
    }
}
