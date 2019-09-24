import { Exclude } from "class-transformer";
import { IsEmail, IsString } from "class-validator";
import { Entity, DeepPartial, PrimaryGeneratedColumn, PrimaryColumn, Column } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity()
export class User extends BaseEntity<User> {
    constructor(dto?: DeepPartial<User>) {
        super();
        this.construct(this, dto);
    }

    @IsString()
    @Column()
    username: string;

    @Exclude({ toPlainOnly: true })
    @Column()
    password: string;

    @IsEmail()
    @Column()
    email: string;

    @IsString()
    @PrimaryGeneratedColumn()
    id: string;
}
