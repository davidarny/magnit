module.exports = {
    tableName: "users",

    attributes: {
        branch_id: {
            type: "number",
        },

        login: {
            type: "string",
            columnType: "text",
        },

        name: {
            type: "string",
            columnType: "text",
        },

        position: {
            type: "string",
            columnType: "text",
        },
    },
};
