import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { Task } from "./task.entity";

@Entity("task_stage")
@EntityConstructor
export class TaskStage {
    constructor(dto?: DeepPartial<TaskStage>) {}

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @ManyToOne(() => Task, task => task.task_stages)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @Column("varchar")
    title: string;

    @Index()
    @Column("timestamptz")
    due_date: string;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: string;
}
