import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Template } from "../../template/entities/template.entity";

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

    @Column("text")
    description: string;

    @Column("varchar")
    status: TTaskStatus;

    @OneToMany(() => Template, template => template.tasks, { cascade: true })
    templates: Template[];

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
