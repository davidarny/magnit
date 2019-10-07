import { Column, DeepPartial, Entity, Generated, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity({ name: "push_token" })
export class PushToken extends BaseEntity {
    constructor(dto?: DeepPartial<PushToken>) {
        super();
        this.construct(this, dto);
    }

    @Generated("rowid")
    @Column()
    id: string;

    @PrimaryColumn()
    id_user: number;

    @PrimaryColumn("varchar")
    token: string;
}
