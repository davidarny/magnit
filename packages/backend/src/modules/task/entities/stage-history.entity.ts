import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { StageHistoryDto } from "../dto/stage-history.dto";
import { TaskStage } from "./task-stage.entity";

@Entity({ name: "stage_history" })
export class StageHistory extends BaseEntity<StageHistory, DeepPartial<StageHistoryDto>> {
    constructor(dto?: DeepPartial<StageHistoryDto>) {
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
