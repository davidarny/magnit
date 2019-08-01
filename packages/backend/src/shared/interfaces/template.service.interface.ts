import { Template } from "../entities/template.entity";

export interface ITemplateService {
    findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        title?: string,
    ): Promise<Template[]>;

    findOneOrFail(id: string): Promise<Template>;

    findByTaskId(id: string): Promise<Template[]>;

    save(template: Template): Promise<Template>;

    findById(id: string): Promise<Template>;

    deleteById(id: string): Promise<void>;
}
