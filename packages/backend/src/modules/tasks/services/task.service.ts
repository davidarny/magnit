import { Injectable, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task, TTaskStatus } from "../entities/task.entity";
import { FindManyOptions, Repository } from "typeorm";

@Injectable()
export class TaskService {
    constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}

    async findAll(
        offset: number,
        limit: number,
        sort: "ASC" | "DESC",
        status: TTaskStatus,
        name: string
    ) {
        return this.taskRepository.find({
            order: { name: sort },
            where: { name },
            skip: offset,
            take: limit,
        });
    }

    async save(task: Task) {
        return this.taskRepository.save(task);
    }

    async findById(id: string) {
        return this.taskRepository.findOne({ where: { id } });
    }

    async deleteById(id: string) {
        return this.taskRepository.delete(id);
    }
}
