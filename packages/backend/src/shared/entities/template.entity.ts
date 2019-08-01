import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Section } from "./section.entity";
import { Task } from "../../modules/tasks/entities/task.entity";

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

    @OneToMany(() => Section, section => section.template, { cascade: true })
    sections: Section[];

    @ManyToMany(() => Task, task => task.templates)
    @JoinTable({
        name: "task_x_template",
        joinColumn: { name: "id_template", referencedColumnName: "id" },
        inverseJoinColumn: { name: "id_task", referencedColumnName: "id" },
    })
    tasks: Task[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
