import {
    ArgumentMetadata,
    Inject,
    Injectable,
    NotFoundException,
    PipeTransform,
} from "@nestjs/common";
import { TemplateService } from "../../../shared/services/template.service";

@Injectable()
export class TemplateByIdPipe implements PipeTransform<string, Promise<string>> {
    constructor(@Inject(TemplateService) private readonly templateService: TemplateService) {}

    async transform(id: string, metadata: ArgumentMetadata): Promise<string> {
        if (!(await this.templateService.findById(id))) {
            throw new NotFoundException(`Template with id ${id} was not found`);
        }
        return id;
    }
}
