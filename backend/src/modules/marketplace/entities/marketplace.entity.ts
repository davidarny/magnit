import { Column, Entity, Index } from "typeorm";
import { PrimaryBaseEntity } from "../../../shared/entities/primary-base.entity";

@Entity()
@Index(["region", "city", "format", "address"], { unique: true })
export class Marketplace extends PrimaryBaseEntity {
    @Index()
    @Column("varchar")
    region: string;

    @Index()
    @Column("varchar")
    city: string;

    @Index()
    @Column("varchar")
    format: string;

    @Index()
    @Column("varchar")
    address: string;
}
