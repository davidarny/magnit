import { BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntity<E, T> {
    protected construct?(entity?: E, dto?: T) {
        if (entity && dto) {
            Object.assign(entity, dto);
        }
    }

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: string;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: string;

    @BeforeUpdate()
    private updateUpdatedAt?() {
        this.updated_at = new Date().toISOString();
    }
}
