import { Exclude } from "class-transformer";
import { IsEmail, IsString, IsNumber } from "class-validator";
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
import { Comment } from "../../task/entities/comment.entity";
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

    @IsString()
    @PrimaryGeneratedColumn()
    id: number;

    @IsEmail()
    @Column()
    email: string;

    @IsString()
    @Column("varchar")
    firstName: string;

    @IsString()
    @Column("varchar")
    lastName: string;

    @IsString()
    @Column({ type: "varchar", nullable: true })
    patronymic: string;

    @IsString()
    @Column({ type: "varchar", nullable: true })
    region: string;

    @IsString()
    @Column({ type: "varchar", nullable: true })
    department: string;

    @Index()
    @Column("int")
    id_role: number;

    @ManyToOne(() => UserRole, role => role.users)
    @JoinColumn({ name: "id_role" })
    role: UserRole;

    @IsNumber()
    @Column({ type: "int", default: 1 })
    level: number = 1;

    @OneToMany(type => Comment, comment => comment.user)
    comments: Comment[];

    // @OneToMany(type => Task, task => task.owner)
    // ownerTasks: Task[];
}
