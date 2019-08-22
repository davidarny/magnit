import { Column, DeepPartial, Entity, Index, OneToMany } from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { TaskStage } from "./task-stage.entity";
import { TemplateAssignment } from "./tempalte-assignment.entity";

export type TTaskStatus = "in_progress" | "on_check" | "draft" | "completed";

@Entity()
@EntityConstructor
export class Task extends BaseEntity {
    constructor(dto?: DeepPartial<Task>) {
        super();
    }

    @Index()
    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Index()
    @Column("varchar")
    status: TTaskStatus;

    @OneToMany(() => TemplateAssignment, template_assignment => template_assignment.task, {
        cascade: true,
    })
    assignments: TemplateAssignment[];

    @OneToMany(() => TaskStage, task_stage => task_stage.task, { cascade: true })
    stages: TaskStage[];
}
