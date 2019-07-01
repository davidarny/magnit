module.exports = {
    tableName: "tasks",

    attributes: {
        object_id: {
            type: "number",
        },

        user_id: {
            type: "number",
        },

        name: {
            type: "string",
            columnType: "text",
        },

        description: {
            type: "string",
            columnType: "text",
        },

        departure_date: {
            type: "ref",
            columnType: "timestamp",
        },

        deadline_date: {
            type: "ref",
            columnType: "timestamp",
        },

        status: {
            type: "string",
        },
    },
};
