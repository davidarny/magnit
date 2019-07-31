import {
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Section } from "./section.entity";

export type TTemplateType = "light" | "complex";

type TConstructableTemplate = Omit<Template, "sections">;

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

    @OneToMany(type => Section, section => section.template, { cascade: true })
    sections: Section[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: number;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: number;
}
