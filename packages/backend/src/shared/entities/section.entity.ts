import {
    Check,
    Column,
    DeepPartial,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Template } from "./template.entity";
import { Puzzle } from "./puzzle.entity";

type TConstructableSection = Omit<Section, "template" | "puzzles">;

@Entity()
export class Section {
    constructor(section?: DeepPartial<TConstructableSection>) {
        if (section) {
            Object.assign(this, section);
        }
    }

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Index()
    @ManyToOne(() => Template, template => template.sections, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_template" })
    template: Template;

    @OneToMany(() => Puzzle, puzzle => puzzle.section, { cascade: true })
    puzzles: Puzzle[];

    @Column("varchar")
    title: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Index()
    @Column("bigint")
    @Check(`"order" >= 0`)
    order: number;
}
