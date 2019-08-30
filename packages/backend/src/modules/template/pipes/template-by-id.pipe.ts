import { ArgumentMetadata, Inject, Injectable, PipeTransform } from "@nestjs/common";
import { TemplateNotFoundException } from "../../../shared/exceptions/template-not-found.exception";
import { TemplateService } from "../services/template.service";

@Injectable()
export class TemplateByIdPipe implements PipeTransform<string, Promise<string>> {
    constructor(@Inject(TemplateService) private readonly templateService: TemplateService) {}

    async transform(id: string, metadata: ArgumentMetadata): Promise<string> {
        if (!(await this.templateService.findById(id))) {
            throw new TemplateNotFoundException(`Template with id ${id} was not found`);
        }
        return id;
    }
}
