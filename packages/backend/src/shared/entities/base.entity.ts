import { BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class BaseEntity {
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
