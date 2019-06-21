module.exports = {
    friendlyName: "",

    description: ``,

    inputs: {
        id: {
            type: "number",
            required: true,
        },
    },

    exits: {
        forbidden: {
            statusCode: 403,
        },
        notFound: {
            statusCode: 404,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            const id = _.escape(inputs.id);

            const template = await Template.findOne({ id: id });

            if (!template) {
                return exits.notFound({ success: 0, message: "template does not exist" });
            }

            const taskTemplatesCount = await TaskTemplate.find({ template_id: template.id });

            if (taskTemplatesCount > 0) {
                return exits.forbidden({
                    success: 0,
                    message: "template assigned to task; deletion impossible",
                });
            }

            await Template.destroy({ id: template.id });

            return exits.success({ success: 1 });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
