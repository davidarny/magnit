import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { FullStageHistoryDto } from "../dto/stage-history.dto";
import { TaskStage } from "./task-stage.entity";

@Entity({ name: "stage_history" })
export class StageHistory extends PrimaryBaseEntity {
    constructor(dto?: DeepPartial<FullStageHistoryDto>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @ManyToOne(() => TaskStage, stage => stage.history, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_stage" })
    stage: TaskStage;

    @Column({ type: "text", nullable: true })
    description: string;
}
