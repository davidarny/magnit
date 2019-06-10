module.exports = {
    friendlyName: "",

    description: ``,

    inputs: {
        template: {
            type: "json",
            required: true,
        },
    },

    exits: {
        badRequest: {
            statusCode: 400,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            if (typeof inputs.template === "string") {
                let valid = await sails.helpers.isJsonValid(inputs.template);

                if (!valid) {
                    return exits.badRequest({ success: 0, message: "Not valid JSON" });
                }

                inputs.template = JSON.parse(inputs.template);
            }

            return exits.success({ success: 1, message: "Ok" });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
