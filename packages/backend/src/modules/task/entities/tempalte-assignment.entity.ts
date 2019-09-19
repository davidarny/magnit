import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { Template } from "../../template/entities/template.entity";
import { Comment } from "./comment.entity";
import { Task } from "./task.entity";

@Entity({ name: "template_assignment" })
export class TemplateAssignment extends PrimaryBaseEntity<TemplateAssignment> {
    constructor(dto?: DeepPartial<TemplateAssignment>) {
        super();
        this.construct(this, dto);
    }

    @Column({ type: "boolean", default: true })
    editable: boolean;

    @Index()
    @Column({ nullable: true })
    id_task: number;

    @ManyToOne(() => Task)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @Index()
    @Column({ nullable: true })
    id_template: number;

    @ManyToOne(() => Template)
    @JoinColumn({ name: "id_template", referencedColumnName: "id" })
    template: Template;

    @OneToOne(() => Comment, comment => comment.assignment)
    comments: Comment[];
}
