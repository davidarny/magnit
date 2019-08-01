import { Section } from "../entities/section.entity";

export interface ISectionService {
    findByTemplateId(id: number): Promise<Section[]>;
}
