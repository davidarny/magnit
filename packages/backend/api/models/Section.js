module.exports = {
    tableName: "sections",

    attributes: {
        title: {
            type: "string",
            columnType: "text",
        },

        description: {
            type: "string",
            columnType: "text",
            allowNull: true,
        },

        template_id: {
            type: "number",
        },

        order: {
            type: "number",
        },
    },
};
