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
import { TemplateAssignment } from "../../task/entities/tempalte-assignment.entity";

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

    @Column({ type: "jsonb", default: [] })
    sections: object;

    @OneToMany(() => TemplateAssignment, template_assignment => template_assignment.template, {
        cascade: true,
    })
    template_assignments: TemplateAssignment[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: string;
}
