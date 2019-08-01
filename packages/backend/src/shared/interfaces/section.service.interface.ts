import { Section } from "../../modules/template/entities/section.entity";

export interface ISectionService {
    findByTemplateId(id: number): Promise<Section[]>;
}
