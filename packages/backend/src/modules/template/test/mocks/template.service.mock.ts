import { Template } from "../../entities/template.entity";

const payload = require("../payload.json");

export const templateService = {
    async findAll() {
        return [];
    },

    async findByTaskId(id: string) {
        return [];
    },

    async save(template: Template) {
        return template;
    },

    async findById(id: string) {
        if (payload.id !== parseInt(id)) {
            return undefined;
        }
        const buffer = { ...payload };
        delete buffer.sections;
        return { ...buffer };
    },

    async deleteById(id: string) {
        return undefined;
    },
};
