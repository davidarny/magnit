module.exports = {
    tableName: "tasks",

    attributes: {
        object_id: {
            type: "number",
            allowNull: true,
        },

        user_id: {
            type: "number",
            allowNull: true,
        },

        name: {
            type: "string",
            columnType: "text",
            allowNull: true,
        },

        description: {
            type: "string",
            columnType: "text",
            allowNull: true,
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
            allowNull: true,
        },
    },
};
