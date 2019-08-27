import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntityWithNonPrimaryId } from "../../../shared/entities/base-entity-with-non-primary-id.entity";
import { Template } from "./template.entity";

@Entity("template_answer")
export class TemplateAnswer extends BaseEntityWithNonPrimaryId<TemplateAnswer> {
    constructor(dto?: DeepPartial<TemplateAnswer>) {
        super();
        this.construct(this, dto);
    }

    @Column({ primary: true })
    id_template: string;

    @Index()
    @ManyToOne(() => Template, template => template.answers)
    @JoinColumn({ name: "id_template", referencedColumnName: "id" })
    template: Template;

    @Index()
    @Column({ type: "varchar", primary: true })
    id_puzzle: string;

    @Column("varchar")
    answer_type: string;

    @Column({ type: "varchar", primary: true })
    answer: string;

    @Column({ type: "text", nullable: true })
    comment: string;
}
