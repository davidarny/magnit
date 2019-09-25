import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import {
    Entity,
    DeepPartial,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    Index,
} from "typeorm";
import { ConstructableEntity } from "../../../shared/entities/constructable.entity";
import { UserRole } from "./user.role.entity";

export class User extends ConstructableEntity<User> {
    constructor(dto?: DeepPartial<User>) {
        super();
        this.construct(this, dto);
    }

    @IsString()
    username: string;

    @Exclude({ toPlainOnly: true })
    password: string;

    @IsString()
    id: string;

    @IsEmail()
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
    @PrimaryColumn()
    id_role: number;

    @ManyToOne(() => UserRole, role => role.users)
    @JoinColumn({ name: "id_role", referencedColumnName: "id" })
    role: UserRole;

    @Column({ type: "number" })
    level: number;
}
