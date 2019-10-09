import { Exclude } from "class-transformer";
import {
    Entity,
    DeepPartial,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    Index,
    OneToMany,
} from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";
import { UserRole } from "./user.role.entity";
import { Task } from "../../task/entities/task.entity";

@Entity()
export class User extends BaseEntity {
    constructor(dto?: DeepPartial<User>) {
        super();
        this.construct(this, dto);
    }

    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column("varchar")
    firstName: string;

    @Column("varchar")
    lastName: string;

    @Column({ type: "varchar", nullable: true })
    patronymic: string;

    @Column({ type: "varchar", nullable: true })
    region: string;

    @Column({ type: "varchar", nullable: true })
    department: string;

    @Index()
    @Column("int")
    id_role: number;

    @ManyToOne(() => UserRole)
    @JoinColumn({ name: "id_role" })
    role: UserRole;

    @OneToMany(() => Task, task => task.owner)
    tasks: Task[];
}
