import { Column, Entity, OneToMany } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { TemplateAnswer } from "./template-answer.entity";

export enum ENoLocationReason {
    LOCATION_DISABLED,
    LOCATION_NOT_DETERMINED,
    PERMISSION_NOT_GRANTED,
    NOT_SUPPORTED,
}

@Entity("template_answer_location")
export class TemplateAnswerLocation extends PrimaryBaseEntity {
    @OneToMany(
        () => TemplateAnswer,
        template_answer => template_answer.location,
    )
    answers: TemplateAnswer[];

    @Column({ type: "varchar", nullable: true })
    provider: string | null;

    @Column({ type: "double precision", nullable: true })
    latitude: number | null;

    @Column({ type: "double precision", nullable: true })
    longitude: number | null;

    @Column({ type: "double precision", nullable: true })
    altitude: number | null;

    @Column({ type: "double precision", nullable: true })
    accuracy_meters: number | null;

    @Column({ type: "boolean", nullable: true })
    no_location_reason: ENoLocationReason | null;
}
