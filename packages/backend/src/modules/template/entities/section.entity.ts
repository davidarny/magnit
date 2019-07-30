import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Template } from "./template.entity";
import { Puzzle } from "./puzzle.entity";

@Entity()
export class Section {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(type => Template, template => template.sections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @OneToMany(type => Puzzle, puzzle => puzzle.section, { nullable: true, cascade: true })
    puzzles: Puzzle[];

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column("int")
    order: number;
}
