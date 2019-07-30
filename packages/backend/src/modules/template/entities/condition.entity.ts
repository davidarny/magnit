import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Puzzle } from "./puzzle.entity";

export type TActionType =
    | "chosen_answer"
    | "given_answer"
    | "equal"
    | "not_equal"
    | "more_than"
    | "less_than";

export type TConditionType = "or" | "and";

@Entity()
export class Condition {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Puzzle, puzzle => puzzle.conditions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_puzzle" })
    puzzle: Puzzle;

    @ManyToOne(() => Puzzle, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_question_puzzle" })
    questionPuzzle: Puzzle;

    @Column({ type: "varchar", nullable: true, name: "action_type" })
    actionType: TActionType;

    @ManyToOne(() => Puzzle, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_answer_puzzle" })
    answerPuzzle: Puzzle;

    @Column({ type: "varchar", default: "" })
    value: string;

    @Column({ type: "varchar", nullable: true, name: "condition_type" })
    conditionType: TConditionType;
}
