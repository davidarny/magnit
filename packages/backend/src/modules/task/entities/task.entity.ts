import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { Marketplace } from "../../marketplace/entities/marketplace.entity";
import { TemplateAnswer } from "../../template/entities/template-answer.entity";
import { TaskDocument } from "./task-document.entity";
import { TaskStage } from "./task-stage.entity";
import { TemplateAssignment } from "./tempalte-assignment.entity";
import { User } from "../../user/entities/user.entity";

export enum ETaskStatus {
    IN_PROGRESS = "in_progress",
    ON_CHECK = "on_check",
    DRAFT = "draft",
    COMPLETED = "completed",
    EXPIRED = "expired",
}

@Entity()
export class Task extends PrimaryBaseEntity {
    constructor(dto?: DeepPartial<Task>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Index()
    @Column("varchar")
    status: ETaskStatus;

    @Column()
    id_owner: number;

    @ManyToOne(type => User, owner => owner.tasks, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_owner" })
    owner: User;

    @Index()
    @Column({ type: "int", nullable: true })
    id_assignee: number | null;

    @Column({ type: "int", default: 3 })
    notify_before: number;

    @Index()
    @Column({ nullable: true })
    id_marketplace: number | null;

    @ManyToOne(() => Marketplace)
    @JoinColumn({ name: "id_marketplace", referencedColumnName: "id" })
    marketplace: Marketplace;

    @OneToMany(() => TemplateAssignment, assignment => assignment.task)
    assignments: TemplateAssignment[];

    @OneToMany(() => TemplateAnswer, answer => answer.task)
    answers: TemplateAnswer[];

    @OneToMany(() => TaskStage, stage => stage.task)
    stages: TaskStage[];

    @OneToMany(() => TaskDocument, document => document.task)
    documents: TaskDocument[];
}
