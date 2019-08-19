import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Task } from "../../modules/task/entities/task.entity";

export type TTemplateType = "light" | "complex";

type TConstructableTemplate = Omit<Template, "sections" | "tasks">;

@Entity()
export class Template {
    constructor(template?: DeepPartial<TConstructableTemplate>) {
        if (template) {
            Object.assign(this, template);
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "json", nullable: true })
    json: object;

    @ManyToMany(() => Task, task => task.templates)
    tasks: Task[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
