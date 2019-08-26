import { Repository, Transaction, TransactionRepository } from "typeorm";
import { TemplateAnswer } from "../entities/template-answer.entity";
import { IPuzzle, Template } from "../entities/template.entity";

export interface ITemplateService {
    findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        title?: string,
    ): Promise<Template[]>;

    findByPuzzleId(
        id: string,
        templateAnswerRepository?: Repository<TemplateAnswer>,
    ): Promise<TemplateAnswer>;

    findOneOrFail(id: string): Promise<Template>;

    findByTaskId(id: string): Promise<Template[]>;

    insert(template: Template): Promise<Template>;

    update(id: string, template: Template): Promise<Template>;

    findById(id: string): Promise<Template>;

    deleteById(id: string): Promise<void>;

    findPuzzlesByIds(id: string, ids: string[]): Promise<Map<string, IPuzzle>>;

    findAnswersById(id: string): Promise<TemplateAnswer[]>;

    insertAnswerBulk(assets: TemplateAnswer[]): Promise<TemplateAnswer[]>;
}
