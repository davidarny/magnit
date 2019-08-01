import { ArgumentMetadata, Inject, NotFoundException, PipeTransform } from "@nestjs/common";
import { TemplateService } from "../../../shared/services/template.service";

export class TemplatesByIdsPipe implements PipeTransform<number[], Promise<number[]>> {
    constructor(@Inject(TemplateService) private readonly templateService: TemplateService) {}

    async transform(ids: number[], metadata: ArgumentMetadata): Promise<number[]> {
        const promises = ids.map(async id => this.templateService.findOneOrFail(id.toString()));
        try {
            await Promise.all(promises);
        } catch (error) {
            throw new NotFoundException(`Template with ID ${ids.join(" or ")} was not found`);
        }
        return ids;
    }
}
