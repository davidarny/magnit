import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { TaskToTemplate } from "../../task/entities/task-to-template.entity";

export type TTemplateType = "light" | "complex";

@Entity()
@EntityConstructor
export class Template {
    constructor(dto?: DeepPartial<Template>) {}

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "jsonb", nullable: true })
    sections: object;

    @OneToMany(() => TaskToTemplate, task_to_template => task_to_template.template, {
        cascade: true,
    })
    task_to_template: TaskToTemplate[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
