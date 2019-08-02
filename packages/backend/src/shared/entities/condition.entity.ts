import {
    Column,
    DeepPartial,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Puzzle } from "./puzzle.entity";

export type TActionType =
    | "chosen_answer"
    | "given_answer"
    | "equal"
    | "not_equal"
    | "more_than"
    | "less_than";

export type TConditionType = "or" | "and";

type TConstructableCondition = Omit<Condition, "puzzle" | "question_puzzle" | "answer_puzzle">;

@Entity()
export class Condition {
    constructor(condition?: DeepPartial<TConstructableCondition>) {
        if (condition) {
            Object.assign(this, condition);
        }
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Puzzle, puzzle => puzzle.conditions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_puzzle" })
    puzzle: Puzzle;

    @Column({ nullable: true })
    id_question_puzzle: string;

    @ManyToOne(() => Puzzle, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_question_puzzle" })
    question_puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true, name: "action_type" })
    action_type: TActionType;

    @Column({ nullable: true })
    id_answer_puzzle: string;

    @ManyToOne(() => Puzzle, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_answer_puzzle" })
    answer_puzzle: Puzzle;

    @Column({ type: "varchar", default: "" })
    value: string;

    @Column({ type: "varchar", nullable: true, name: "condition_type" })
    condition_type: TConditionType;
}
