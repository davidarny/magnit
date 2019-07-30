const payload = require("../payload.json");

export const sectionService = {
    async findByTemplateId(id: number) {
        if (payload.id !== id) {
            return;
        }
        return payload.sections.map(section => {
            const buffer = { ...section };
            delete buffer.puzzles;
            return { ...buffer };
        });
    },
};
