import {
    Column,
    DeepPartial,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Puzzle } from "./puzzle.entity";

export type TOperatorType = "less_than" | "more_than" | "equal" | "less_or_equal" | "more_or_equal";

export type TValidationType = "compare_with_answer" | "set_value";

type TConstructableValidation = Omit<
    Validation,
    "puzzle" | "left_hand_puzzle" | "right_hand_puzzle"
>;

@Entity()
export class Validation {
    constructor(validation?: DeepPartial<TConstructableValidation>) {
        if (validation) {
            Object.assign(this, validation);
        }
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Puzzle, puzzle => puzzle.validations, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_puzzle" })
    puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true })
    left_hand_puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true, name: "action_type" })
    validation_type: TValidationType;

    @Column({ type: "varchar", nullable: true })
    right_hand_puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true })
    value: string;

    @Column({ type: "varchar", nullable: true, name: "operator_type" })
    operator_type: TOperatorType;

    @Column({ type: "text", name: "error_message" })
    error_message: string;
}
