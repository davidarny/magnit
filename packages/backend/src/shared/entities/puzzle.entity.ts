import {
    Column,
    DeepPartial,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    TreeChildren,
    TreeParent,
} from "typeorm";
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

type TConstructablePuzzle = Omit<
    Puzzle,
    "template" | "section" | "parent" | "puzzles" | "conditions" | "validations"
>;

@Entity()
export class Puzzle {
    constructor(puzzle?: DeepPartial<TConstructablePuzzle>) {
        if (puzzle) {
            Object.assign(this, puzzle);
        }
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @ManyToOne(() => Template, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @ManyToOne(() => Section, section => section.puzzles, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_section" })
    section: Section;

    @TreeParent()
    @JoinColumn({ name: "id_parent" })
    parent: Puzzle;

    @TreeChildren({ cascade: true })
    puzzles: Puzzle[];

    @Column("int")
    order: number;

    @Column({ type: "varchar", name: "puzzle_type" })
    puzzle_type: TPuzzleType;

    @Column({ type: "varchar", name: "answer_type", nullable: true })
    answer_type: TAnswerType;

    @OneToMany(() => Condition, condition => condition.puzzle, { cascade: true, eager: true })
    conditions: Condition[];

    @OneToMany(() => Validation, validation => validation.puzzle, { cascade: true, eager: true })
    validations: Validation[];
}
