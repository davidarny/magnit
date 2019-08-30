import { BeforeUpdate, CreateDateColumn, DeepPartial, UpdateDateColumn } from "typeorm";
import { ConstructableEntity } from "./constructable.entity";

export abstract class BaseEntity<E, T = DeepPartial<E>> extends ConstructableEntity<E, T> {
    @CreateDateColumn({ type: "timestamptz" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: string;

    @BeforeUpdate()
    private updateUpdatedAt?() {
        this.updated_at = new Date().toISOString();
    }
}
