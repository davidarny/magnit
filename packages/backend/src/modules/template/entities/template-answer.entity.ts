import { Column, DeepPartial, Entity, Generated, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Template } from "./template.entity";

@Entity("template_answer")
export class TemplateAnswer extends BaseEntity<TemplateAnswer> {
    constructor(dto?: DeepPartial<TemplateAnswer>) {
        super();
        this.construct(this, dto);
    }

    @Column()
    @Generated("rowid")
    id: number;

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
