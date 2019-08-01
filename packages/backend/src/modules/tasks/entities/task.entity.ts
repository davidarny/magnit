import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Template } from "../../../shared/entities/template.entity";

export type TTaskStatus = "in_progress" | "on_check" | "draft" | "completed";

type TConstructableTask = Omit<Task, "templates">;

@Entity()
export class Task {
    constructor(task?: DeepPartial<TConstructableTask>) {
        if (task) {
            Object.assign(this, task);
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column("varchar")
    status: TTaskStatus;

    @ManyToMany(() => Template, template => template.tasks)
    @JoinTable({
        name: "task_x_template",
        joinColumn: { name: "id_task", referencedColumnName: "id" },
        inverseJoinColumn: { name: "id_template", referencedColumnName: "id" },
    })
    templates: Template[];

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
