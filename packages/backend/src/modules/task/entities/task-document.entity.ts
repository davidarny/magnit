import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { Task } from "./task.entity";

@Entity("task_document")
export class TaskDocument extends PrimaryBaseEntity<TaskDocument> {
    constructor(dto?: DeepPartial<TaskDocument>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @Column()
    id_task: number;

    @ManyToOne(() => Task, task => task.stages, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_task" })
    task: Task;

    @Column("varchar")
    filename: string;

    @Column({ type: "varchar", nullable: true })
    original_name: string;
}
