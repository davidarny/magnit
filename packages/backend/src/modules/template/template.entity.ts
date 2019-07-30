import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Section } from "./section.entity";

export type TTemplateType = "light" | "complex";

@Entity()
export class Template {
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
}
