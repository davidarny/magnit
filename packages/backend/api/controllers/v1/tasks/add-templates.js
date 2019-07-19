module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        id: {
            type: "number",
            required: true,
        },
        templates: {
            type: "ref",
            required: true,
        },
    },

    exits: {
        badRequest: {
            statusCode: 400,
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
            const taskId = _.escape(inputs.id);

            // check if templates exist
            try {
                await Promise.all(
                    inputs.templates.map(templateId => Template.find({ id: templateId }))
                );
            } catch (err) {
                console.log(err);
                return exits.notFound({ success: 0, message: "Template missing for one of IDs" });
            }

            await Promise.all(
                inputs.templates.map(
                    async templateId =>
                        await TaskTemplate.create({
                            task_id: taskId,
                            template_id: templateId,
                        })
                )
            );

            return exits.success({ success: 1 });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
