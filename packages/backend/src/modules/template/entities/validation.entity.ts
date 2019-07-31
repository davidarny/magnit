import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Puzzle } from "./puzzle.entity";

export type TOperatorType = "less_than" | "more_than" | "equal" | "less_or_equal" | "more_or_equal";

export type TValidationType = "compare_with_answer" | "set_value";

@Entity()
export class Validation {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Puzzle, puzzle => puzzle.validations, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_puzzle" })
    puzzle: Puzzle;

    @ManyToOne(() => Puzzle, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_left_hand_puzzle" })
    left_hand_puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true, name: "action_type" })
    validation_type: TValidationType;

    @ManyToOne(() => Puzzle, undefined, { nullable: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "id_right_hand_puzzle" })
    right_hand_puzzle: Puzzle;

    @Column({ type: "varchar", nullable: true })
    value: string;

    @Column({ type: "varchar", nullable: true, name: "operator_type" })
    operator_type: TOperatorType;

    @Column({ type: "text", name: "error_message" })
    error_message: string;
}
