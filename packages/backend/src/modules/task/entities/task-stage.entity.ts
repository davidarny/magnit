import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { StageHistory } from "./stage-history.entity";
import { Task } from "./task.entity";

@Entity("task_stage")
@Index((stage: TaskStage) => [stage.id_task, stage.created_at, stage.finished, stage.deadline])
export class TaskStage extends PrimaryBaseEntity<TaskStage> {
    constructor(dto?: DeepPartial<TaskStage>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @Column()
    id_task: number;

    @ManyToOne(() => Task, task => task.stages)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @OneToMany(() => StageHistory, history => history.stage)
    history: StageHistory[];

    @Column("varchar")
    title: string;

    @Index()
    @Column({ type: "boolean", default: false })
    finished: boolean;

    @Index()
    @Column("timestamptz")
    deadline: string;
}
