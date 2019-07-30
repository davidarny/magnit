import { Template } from "../../entities/template.entity";

const payload = require("../payload.json");

export const templateService = {
    async findAll() {
        return [];
    },

    async save(template: Template) {
        return template;
    },

    async findById(id: string) {
        const buffer = { ...payload };
        delete buffer.sections;
        return { ...buffer };
    },
};
