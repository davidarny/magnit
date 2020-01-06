import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { Template } from "../../template/entities/template.entity";
import { Comment } from "./comment.entity";
import { Task } from "./task.entity";

@Entity({ name: "template_assignment" })
export class TemplateAssignment extends PrimaryBaseEntity {
    @Column({ type: "boolean", default: true })
    editable: boolean;

    @Index()
    @Column({ nullable: true })
    id_task: number;

    @ManyToOne(() => Task, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_task" })
    task: Task;

    @Index()
    @Column({ nullable: true })
    id_template: number;

    @ManyToOne(() => Template, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @OneToMany(
        () => Comment,
        comment => comment.assignment,
    )
    comments: Comment[];
}
