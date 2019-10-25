import { Column, Entity, Generated, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity({ name: "push_token" })
export class PushToken extends BaseEntity {
    @Generated("rowid")
    @Column()
    id: string;

    @PrimaryColumn("varchar")
    id_user: string;

    @PrimaryColumn("varchar")
    token: string;
}
