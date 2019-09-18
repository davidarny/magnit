import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { TemplateNotFoundException } from "../../../shared/exceptions/template-not-found.exception";
import { TemplateService } from "../../template/services/template.service";

@Injectable()
export class TemplatesByIdsPipe implements PipeTransform<number[], Promise<number[]>> {
    constructor(private readonly templateService: TemplateService) {}

    async transform(ids: number[], metadata: ArgumentMetadata): Promise<number[]> {
        const promises = ids.map(async id => this.templateService.findOneOrFail(id));
        try {
            await Promise.all(promises);
        } catch (error) {
            throw new TemplateNotFoundException(
                `Template with ID ${ids.join(" or ")} was not found`,
            );
        }
        return ids;
    }
}
