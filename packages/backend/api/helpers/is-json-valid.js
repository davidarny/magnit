module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        str: {
            type: "string",
            required: true,
        },
    },

    exits: {
        success: {
            outputType: "boolean",
        },
    },

    fn: async function(inputs, exits) {
        let result = true;
        try {
            JSON.parse(inputs.str);
        } catch (e) {
            result = false;
        }

        return exits.success(result);
    },
};
