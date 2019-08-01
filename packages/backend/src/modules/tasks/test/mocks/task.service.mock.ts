import { Task } from "../../entities/task.entity";

export const taskService = {
    taskRepository: [],

    async findAll() {
        return this.taskRepository;
    },

    async save(task: Task) {
        const index = this.taskRepository.findIndex(task => task.id === parseInt(task.id));
        if (index === -1) {
            this.taskRepository.push(task);
        } else {
            this.taskRepository[index] = { ...this.taskRepository[index], ...task };
        }
        return task;
    },

    async deleteById(id: string) {
        const index = this.taskRepository.findIndex(task => task.id === parseInt(id));
        if (index !== -1) {
            this.taskRepository.splice(index, 1);
        }
    },

    async findById(id: string) {
        return this.taskRepository.find(task => task.id === parseInt(id));
    },
};
