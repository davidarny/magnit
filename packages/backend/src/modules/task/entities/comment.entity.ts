import { Column, DeepPartial, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";
import { TemplateAssignment } from "./tempalte-assignment.entity";
import { User } from "../../user/entities/user.entity";

@Entity()
export class Comment extends PrimaryBaseEntity {
    constructor(dto?: DeepPartial<Comment>) {
        super();
        this.construct(this, dto);
    }

    @Index()
    @Column()
    id_user: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "id_user" })
    user: User;

    @Column("text")
    text: string;

    @Index()
    @Column()
    id_assignment: number;

    @ManyToOne(() => TemplateAssignment, assignment => assignment.comments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_assignment" })
    assignment: TemplateAssignment;
}
