import { Column, DeepPartial, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { TemplateAssignment } from "../../task/entities/tempalte-assignment.entity";

export type TTemplateType = "light" | "complex";

@Entity()
@EntityConstructor
export class Template extends BaseEntity {
    constructor(dto?: DeepPartial<Template>) {
        super();
    }

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
    assignments: TemplateAssignment[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;
}
