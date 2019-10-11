import { Entity, PrimaryColumn, Column, DeepPartial } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";

@Entity()
export class UserRole extends PrimaryBaseEntity {
    constructor(dto?: DeepPartial<UserRole>) {
        super();
        this.construct(this, dto);
    }

    @PrimaryColumn()
    id: number;

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;
}
