import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { StageHistory } from "./stage-history.entity";
import { Task } from "./task.entity";

@Entity("task_stage")
export class TaskStage extends BaseEntity<TaskStage, DeepPartial<TaskStage>> {
    constructor(dto?: DeepPartial<TaskStage>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @ManyToOne(() => Task, task => task.stages)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @OneToMany(() => StageHistory, history => history.stage, { cascade: true })
    history: StageHistory[];

    @Column("varchar")
    title: string;

    @Index()
    @Column("timestamptz")
    due_date: string;
}
