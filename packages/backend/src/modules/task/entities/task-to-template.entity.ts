import {
    Column,
    DeepPartial,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { EntityConstructor } from "../../../shared/decorators/entity-constructor.decorator";
import { Template } from "../../template/entities/template.entity";
import { Task } from "./task.entity";

@Entity({ name: "task_to_template" })
@EntityConstructor
export class TaskToTemplate {
    constructor(dto?: DeepPartial<TaskToTemplate>) {}

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "boolean", default: false })
    editable: boolean;

    @Column()
    id_task: number;

    @Index()
    @ManyToOne(() => Task)
    @JoinColumn({ name: "id_task", referencedColumnName: "id" })
    task: Task;

    @Column()
    id_template: number;

    @Index()
    @ManyToOne(() => Template)
    @JoinColumn({ name: "id_template", referencedColumnName: "id" })
    template: Template;
}
