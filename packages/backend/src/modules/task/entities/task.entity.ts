import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { TaskToTemplate } from "./task-to-template.entity";

export type TTaskStatus = "in_progress" | "on_check" | "draft" | "completed";

@Entity()
@EntityConstructor
export class Task {
    constructor(dto?: DeepPartial<Task>) {}

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column("varchar")
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Index()
    @Column("varchar")
    status: TTaskStatus;

    @OneToMany(() => TaskToTemplate, task_to_template => task_to_template.task, { cascade: true })
    task_to_template: TaskToTemplate[];

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
