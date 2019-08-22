import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { Task } from "./task.entity";

@Entity("task_stage")
@EntityConstructor
export class TaskStage extends BaseEntity {
    constructor(dto?: DeepPartial<TaskStage>) {
        super();
    }

    @Index()
    @ManyToOne(() => Task, task => task.stages)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @Column("varchar")
    title: string;

    @Index()
    @Column("timestamptz")
    due_date: string;
}
