module.exports = {
    tableName: "conditions",

    attributes: {
        order: {
            type: "number",
        },

        puzzle_id: {
            type: "number",
        },

        question_puzzle: {
            type: "string",
            isUUID: true,
        },

        action_type: {
            type: "string",
        },

        answer_puzzle: {
            type: "string",
            isUUID: true,
            allowNull: true,
        },

        value: {
            type: "number",
            allowNull: true,
        },

        condition_type: {
            type: "string",
            allowNull: true,
        },
    },
};
