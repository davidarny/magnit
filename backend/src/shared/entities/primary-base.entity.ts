import { PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export abstract class PrimaryBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
}
