import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task, ETaskStatus } from "../entities/task.entity";
import { FindManyOptions, In, Repository } from "typeorm";
import { ITaskService } from "../interfaces/task.service.interface";

@Injectable()
export class TaskService implements ITaskService {
    constructor(@InjectRepository(Task) private readonly taskRepository: Repository<Task>) {}

    async findAll(
        offset?: number,
        limit?: number,
        sort?: "ASC" | "DESC",
        status?: ETaskStatus,
        statuses?: ETaskStatus[],
        title?: string,
    ) {
        const options: FindManyOptions<Task> = {};
        if (typeof offset !== "undefined") {
            options.skip = offset;
        }
        if (typeof limit !== "undefined") {
            options.take = limit;
        }
        if (sort) {
            options.order = { title: sort };
        }
        if (status) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { status });
        }
        if (statuses) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { status: In(statuses) });
        }
        if (title) {
            if (!options.where) {
                options.where = {};
            }
            Object.assign(options.where, { title });
        }
        return this.taskRepository.find(options);
    }

    async insert(task: Task) {
        delete task.id;
        return this.taskRepository.save(task);
    }

    async findById(id: string, relations: string[] = []) {
        return this.taskRepository.findOne({ where: { id }, relations });
    }

    async deleteById(id: string) {
        await this.taskRepository.delete(id);
    }

    async update(id: string, task: Task): Promise<Task> {
        return this.taskRepository.save({ ...task, id: Number(id) });
    }

    getDescriptionByTransition(
        prevStatus: ETaskStatus,
        nextStatus: ETaskStatus,
    ): string | undefined {
        return {
            [ETaskStatus.DRAFT]: {
                [ETaskStatus.ON_CHECK]: "Отправка задания",
            },
            [ETaskStatus.ON_CHECK]: {
                [ETaskStatus.IN_PROGRESS]: "Начало работы над заданием",
                [ETaskStatus.DRAFT]: "Задание отозвано",
            },
            [ETaskStatus.IN_PROGRESS]: {
                [ETaskStatus.COMPLETED]: "Задание завершено",
                [ETaskStatus.DRAFT]: "Задание отозвано",
            },
        }[prevStatus][nextStatus];
    }
}
