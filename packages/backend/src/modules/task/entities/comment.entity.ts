import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { TemplateAssignment } from "./tempalte-assignment.entity";

@Entity()
export class Comment extends PrimaryBaseEntity {
    @Column("varchar")
    id_user: string;

    @Column("text")
    text: string;

    @Index()
    @Column()
    id_assignment: number;

    @ManyToOne(() => TemplateAssignment, assignment => assignment.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_assignment" })
    assignment: TemplateAssignment;
}
