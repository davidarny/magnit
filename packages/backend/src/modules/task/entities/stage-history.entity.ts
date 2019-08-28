import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { FullStageHistoryDto } from "../dto/stage-history.dto";
import { TaskStage } from "./task-stage.entity";

@Entity({ name: "stage_history" })
export class StageHistory extends PrimaryBaseEntity<
    StageHistory,
    DeepPartial<FullStageHistoryDto>
> {
    constructor(dto?: DeepPartial<FullStageHistoryDto>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @ManyToOne(() => TaskStage, stage => stage.history)
    @JoinColumn({ name: "id_stage", referencedColumnName: "id" })
    stage: TaskStage;

    @Column({ type: "text", nullable: true })
    description: string;
}
