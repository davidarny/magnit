import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { TemplateAssignment } from "./tempalte-assignment.entity";

@Entity()
export class Comment extends PrimaryBaseEntity<Comment> {
    constructor(dto?: DeepPartial<Comment>) {
        super();
        this.construct(this, dto);
    }

    @Column("varchar")
    id_user: string;

    @Column("text")
    text: string;

    @Index()
    @Column()
    id_assignment: number;

    @ManyToOne(() => TemplateAssignment, assignment => assignment.comments)
    @JoinColumn({ name: "id_assignment", referencedColumnName: "id" })
    assignment: TemplateAssignment;
}
