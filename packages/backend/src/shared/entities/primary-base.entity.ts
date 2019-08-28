import { DeepPartial, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export abstract class PrimaryBaseEntity<E, T = DeepPartial<E>> extends BaseEntity<E, T> {
    @PrimaryGeneratedColumn()
    id: number;
}
