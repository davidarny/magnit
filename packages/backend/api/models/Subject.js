module.exports = {
    tableName: "objects",

    attributes: {
        branch_id: {
            type: "number",
        },

        name: {
            type: "string",
            columnType: "text",
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
