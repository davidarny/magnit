import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Template } from "./template.entity";
import { Section } from "./section.entity";
import { Condition } from "./condition.entity";
import { Validation } from "./validation.entity";

export type TPuzzleType =
    | "group"
    | "question"
    | "radio_answer"
    | "checkbox_answer"
    | "dropdown_answer"
    | "reference_answer"
    | "upload_files"
    | "date_answer"
    | "text_answer"
    | "numeric_answer";

@Entity()
export class Puzzle {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToOne(() => Template, undefined, { nullable: true })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @ManyToOne(() => Section, section => section.puzzles, { nullable: true })
    @JoinColumn({ name: "id_section" })
    section: Section;

    @ManyToOne(() => Puzzle, puzzle => puzzle.parent, { nullable: true })
    @JoinColumn({ name: "id_parent" })
    parent: Puzzle;

    @Column("int")
    order: number;

    @Column({ type: "varchar", name: "puzzle_type" })
    puzzleType: TPuzzleType;

    @OneToMany(() => Condition, condition => condition.puzzle, { cascade: true })
    conditions: Condition[];

    @OneToMany(() => Validation, validation => validation.puzzle, { cascade: true })
    validations: Validation[];
}
