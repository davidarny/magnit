module.exports = {
    tableName: "puzzles",

    attributes: {
        title: {
            type: "string",
            columnType: "text",
        },

        template_id: {
            type: "number",
            allowNull: true,
        },

        section_id: {
            type: "number",
            allowNull: true,
        },

        parent_id: {
            type: "number",
            allowNull: true,
        },

        order: {
            type: "number",
        },

        puzzle_type: {
            type: "string",
        },

        answer_type: {
            type: "string",
            allowNull: true,
        },
    },
};
