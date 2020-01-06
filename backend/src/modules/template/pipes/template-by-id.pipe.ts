import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { TemplateNotFoundException } from "../../../shared/exceptions/template-not-found.exception";
import { TemplateService } from "../services/template.service";

@Injectable()
export class TemplateByIdPipe implements PipeTransform<number, Promise<number>> {
    constructor(private readonly templateService: TemplateService) {}

    async transform(id: number, metadata: ArgumentMetadata): Promise<number> {
        if (!(await this.templateService.findById(id))) {
            throw new TemplateNotFoundException(`Template with id ${id} was not found`);
        }
        return id;
    }
}
