import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class NumericIdPipe implements PipeTransform<string | string[], number | number[]> {
    transform(id: string | string[], metadata: ArgumentMetadata): number | number[] {
        if (Array.isArray(id)) {
            const numerics = id.map(Number);
            if (numerics.some(value => Number.isNaN(value))) {
                const invalid = numerics.find(value => Number.isNaN(value));
                throw new BadRequestException(`Invalid id "${invalid}"`);
            }
            return numerics;
        }
        const numeric = Number(id);
        if (Number.isNaN(numeric)) {
            throw new BadRequestException(`Invalid id "${id}"`);
        }
        return numeric;
    }
}
