module.exports = {
    tableName: "objects",

    attributes: {
        branch_id: {
            type: "number",
        },

        name: {
            type: "string",
            columnType: "text",
            allowNull: true,
        },

        address: {
            type: "string",
            columnType: "text",
        },

        format: {
            type: "string",
            columnType: "text",
        },
    },
};
