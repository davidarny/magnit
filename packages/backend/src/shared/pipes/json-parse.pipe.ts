import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class JsonParsePipe implements PipeTransform<any, any> {
    transform(value: any, metadata: ArgumentMetadata): any {
        if (value && typeof value === "object") {
            const keys = Object.keys(value);
            for (const key of keys) {
                try {
                    value[key] = JSON.parse(value[key]);
                } catch {}
            }
        }
        return value;
    }
}
