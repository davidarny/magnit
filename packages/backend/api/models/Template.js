module.exports = {
    tableName: "templates",

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

        type: {
            type: "string",
            columnType: "text",
            allowNull: true,
        },
    },
};
