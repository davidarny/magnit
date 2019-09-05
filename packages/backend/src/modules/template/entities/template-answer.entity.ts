import {
    Column,
    DeepPartial,
    Entity,
    Generated,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Task } from "../../task/entities/task.entity";
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

    @PrimaryColumn()
    id_template: number;

    @Index()
    @ManyToOne(() => Template, template => template.answers)
    @JoinColumn({ name: "id_template", referencedColumnName: "id" })
    template: Template;

    @PrimaryColumn()
    id_task: number;

    @Index()
    @ManyToOne(() => Task, task => task.answers)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @Index()
    @PrimaryColumn({ type: "varchar" })
    id_puzzle: string;

    @Column("varchar")
    answer_type: string;

    @PrimaryColumn({ type: "varchar" })
    answer: string;

    @Column({ type: "text", nullable: true })
    comment: string;
}
