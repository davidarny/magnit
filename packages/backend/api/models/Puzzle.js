module.exports = {
    tableName: "puzzles",

    attributes: {
        uuid: {
            type: "string",
        },

        title: {
            type: "string",
            columnType: "text",
            allowNull: true,
        },

        description: {
            type: "string",
            columnType: "text",
            allowNull: true,
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
