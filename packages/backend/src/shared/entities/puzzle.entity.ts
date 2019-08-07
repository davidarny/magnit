import {
    Check,
    Column,
    DeepPartial,
    Entity,
    Index,
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
    | "upload_files"
    | "date_answer"
    | "text_answer"
    | "numeric_answer"
    | "reference_text"
    | "reference_asset";

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

    @Column({ type: "varchar", nullable: true })
    asset: string;

    @Index()
    @ManyToOne(() => Template, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @Index()
    @ManyToOne(() => Section, section => section.puzzles, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_section" })
    section: Section;

    @Index()
    @TreeParent()
    @JoinColumn({ name: "id_parent" })
    parent: Puzzle;

    @TreeChildren({ cascade: true })
    puzzles: Puzzle[];

    @Index()
    @Column("bigint")
    @Check(`"order" >= 0`)
    order: number;

    @Column({ type: "varchar" })
    puzzle_type: TPuzzleType;

    @OneToMany(() => Condition, condition => condition.puzzle, { cascade: true, eager: true })
    conditions: Condition[];

    @OneToMany(() => Validation, validation => validation.puzzle, { cascade: true, eager: true })
    validations: Validation[];
}
