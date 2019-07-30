const payload = require("../payload.json");

export const puzzleService = {
    async findBySectionId(id: string) {
        return payload.sections.reduce((prev, curr) => {
            if (curr.id !== id) {
                return prev;
            }
            return [...prev, ...curr.puzzles];
        }, []);
    },

    async findByParentId(id: string) {
        const puzzles = await this.findBySectionId(payload.sections[0].id);
        return puzzles.reduce((prev, curr) => {
            if (curr.id !== id) {
                return prev;
            }
            return [...prev, ...(curr.puzzles || [])];
        }, []);
    },
};
