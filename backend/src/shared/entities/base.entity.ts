import { BeforeUpdate, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { ConstructableEntity } from "./constructable.entity";

export abstract class BaseEntity extends ConstructableEntity {
    @CreateDateColumn({ type: "timestamptz" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: string;

    @BeforeUpdate()
    private update?() {
        this.updated_at = new Date().toISOString();
    }
}
