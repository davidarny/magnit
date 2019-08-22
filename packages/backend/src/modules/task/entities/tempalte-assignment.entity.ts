import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    UpdateDateColumn,
} from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Template } from "../../template/entities/template.entity";
import { Task } from "./task.entity";

@Entity({ name: "template_assignment" })
@EntityConstructor
export class TemplateAssignment extends BaseEntity {
    constructor(dto?: DeepPartial<TemplateAssignment>) {
        super();
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
