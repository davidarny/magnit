module.exports = {
    tableName: "validations",

    attributes: {
        order: {
            type: "number",
        },

        operator_type: {
            type: "string",
        },

        validation_type: {
            type: "string",
        },

        left_hand_puzzle: {
            type: "number",
        },

        right_hand_puzzle: {
            type: "number",
        },

        value: {
            type: "number",
        },

        error_message: {
            type: "string",
            columnType: "text",
        },
    },
};
