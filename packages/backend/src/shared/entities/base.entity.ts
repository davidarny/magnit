import { BeforeUpdate, CreateDateColumn, DeepPartial, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity<E, T = DeepPartial<E>> {
    protected construct?(entity?: E, dto?: T) {
        if (entity && dto) {
            Object.assign(entity, dto);
        }
    }

    @CreateDateColumn({ type: "timestamptz" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: string;

    @BeforeUpdate()
    private updateUpdatedAt?() {
        this.updated_at = new Date().toISOString();
    }
}
