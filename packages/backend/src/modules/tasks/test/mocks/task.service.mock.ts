import { Task } from "../../entities/task.entity";

export const taskService = {
    async findAll() {
        return [];
    },

    async save(task: Task) {
        return task;
    },
};
