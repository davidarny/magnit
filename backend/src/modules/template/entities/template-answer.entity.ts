import { Column, Entity, Generated, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Task } from "../../task/entities/task.entity";
import { TemplateAnswerLocation } from "./template-answer-location.entity";
import { Template } from "./template.entity";

@Entity("template_answer")
export class TemplateAnswer extends BaseEntity {
    @Column({ unique: true })
    @Generated("rowid")
    id: number;

    @Index()
    @PrimaryColumn()
    id_template: number;

    @ManyToOne(
        () => Template,
        template => template.answers,
        { onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "id_template" })
    template: Template;

    @Index()
    @PrimaryColumn()
    id_task: number;

    @ManyToOne(
        () => Task,
        task => task.answers,
        { onDelete: "CASCADE" },
    )
    @JoinColumn({ name: "id_task" })
    task: Task;

    @ManyToOne(() => TemplateAnswerLocation, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_location" })
    location: TemplateAnswerLocation;

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
