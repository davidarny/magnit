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
            allowNull: true,
        },

        action_type: {
            type: "string",
            allowNull: true,
        },

        answer_puzzle: {
            type: "string",
            isUUID: true,
            allowNull: true,
        },

        value: {
            type: "ref",
        },

        condition_type: {
            type: "string",
            allowNull: true,
        },
    },
};
