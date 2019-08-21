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
import { TemplateAssignment } from "./tempalte-assignment.entity";

export type TTaskStatus = "in_progress" | "on_check" | "draft" | "completed";

@Entity()
@EntityConstructor
export class Task {
    constructor(dto?: DeepPartial<Task>) {}

    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Index()
    @Column("varchar")
    status: TTaskStatus;

    @OneToMany(() => TemplateAssignment, template_assignment => template_assignment.task, {
        cascade: true,
    })
    template_assignments: TemplateAssignment[];

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
