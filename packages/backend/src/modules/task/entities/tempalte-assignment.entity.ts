import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Template } from "../../template/entities/template.entity";
import { Task } from "./task.entity";

@Entity({ name: "template_assignment" })
export class TemplateAssignment extends BaseEntity<
    TemplateAssignment,
    DeepPartial<TemplateAssignment>
> {
    constructor(dto?: DeepPartial<TemplateAssignment>) {
        super();
        this.construct(this, dto);
    }

    @Column({ type: "boolean", default: false })
    editable: boolean;

    @Column({ nullable: true })
    id_task: number;

    @Index()
    @ManyToOne(() => Task)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @Column({ nullable: true })
    id_template: number;

    @Index()
    @ManyToOne(() => Template)
    @JoinColumn({ name: "id_template", referencedColumnName: "id" })
    template: Template;
}
