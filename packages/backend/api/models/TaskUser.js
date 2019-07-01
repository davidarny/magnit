module.exports = {
    tableName: "task_users",

    attributes: {
        task_id: {
            type: "number",
        },

        user_id: {
            type: "number",
        },

        taken: {
            type: "boolean",
        },
    },
};
