import { Template } from "../entities/template.entity";

export interface IAssemblerService {
    assemble(template: Template): Promise<void>;
}
