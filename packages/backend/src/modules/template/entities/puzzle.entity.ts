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

export type TAnswerType = "number" | "string";

@Entity()
export class Puzzle {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToOne(() => Template, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @ManyToOne(() => Section, section => section.puzzles, { nullable: true })
    @JoinColumn({ name: "id_section" })
    section: Section;

    @ManyToOne(() => Puzzle, puzzle => puzzle.children, { nullable: true })
    @JoinColumn({ name: "id_parent" })
    parent: Puzzle;

    @OneToMany(() => Puzzle, puzzle => puzzle.parent)
    children: Puzzle[];

    @Column("int")
    order: number;

    @Column({ type: "varchar", name: "puzzle_type" })
    puzzle_type: TPuzzleType;

    @Column({ type: "varchar", name: "answer_type", nullable: true })
    answer_type: TAnswerType;

    @OneToMany(() => Condition, condition => condition.puzzle, { cascade: true })
    conditions: Condition[];

    @OneToMany(() => Validation, validation => validation.puzzle, { cascade: true })
    validations: Validation[];
}
