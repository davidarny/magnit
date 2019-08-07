import {
    Column,
    DeepPartial,
    Entity,
    Index,
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

    @Index()
    @ManyToOne(() => Puzzle, puzzle => puzzle.conditions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_puzzle" })
    puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true })
    question_puzzle: string;

    @Column({ type: "varchar", nullable: true })
    action_type: TActionType;

    @Column({ type: "varchar", nullable: true })
    answer_puzzle: string;

    @Column({ type: "varchar", default: "" })
    value: string;

    @Column({ type: "varchar", nullable: true })
    condition_type: TConditionType;
}
