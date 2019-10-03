import { Column, DeepPartial, Entity, Generated, Index, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../../../shared/entities/base.entity";

@Entity()
export class Marketplace extends BaseEntity {
    constructor(dto?: DeepPartial<Marketplace>) {
        super();
        this.construct(this, dto);
    }

    @Column({ unique: true })
    @Generated("rowid")
    id: number;

    @Index()
    @PrimaryColumn("varchar")
    region: string;

    @Index()
    @PrimaryColumn("varchar")
    city: string;

    @Index()
    @PrimaryColumn("varchar")
    format: string;

    @Index()
    @PrimaryColumn("varchar")
    address: string;
}
