import { Column, Entity, OneToMany, PrimaryGeneratedColumn, VersionColumn } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { TemplateAssignment } from "../../task/entities/tempalte-assignment.entity";
import { TemplateAnswer } from "./template-answer.entity";

export type TTemplateType = "light" | "complex";

export interface IPuzzle {
    id: string;
    puzzle_type: string;
    puzzles: IPuzzle[];
}

@Entity()
export class Template extends PrimaryBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "jsonb", default: [] })
    sections: object;

    @OneToMany(() => TemplateAssignment, assignment => assignment.template)
    assignments: TemplateAssignment[];

    @OneToMany(() => TemplateAnswer, answer => answer.template)
    answers: TemplateAnswer[];

    @Column({ type: "varchar", default: "light" })
    type: TTemplateType;

    @VersionColumn({ default: 0 })
    version: number;
}
