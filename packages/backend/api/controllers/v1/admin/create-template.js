module.exports = {
    friendlyName: "",

    description: ``,

    inputs: {
        template: {
            type: "json",
            required: true,
        },
        template_id: {
            type: "number",
        },
        created_at: {
            type: "ref",
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
            let template = inputs.template;
            let templateId = _.escape(inputs.template_id);
            let createdAt = _.escape(inputs.created_at);

            if (typeof template === "string") {
                const valid = await sails.helpers.isJsonValid(template);

                if (!valid) {
                    return exits.badRequest({ success: 0, message: "Not valid JSON" });
                }

                template = JSON.parse(template);
            }

            let criteria = {
                title: template.title,
                description: template.description,
            };

            if (templateId) {
                criteria.id = templateId;
            }

            if (createdAt) {
                criteria.createdAt = createdAt;
            }

            const newTemplate = await Template.create(criteria).fetch();

            if (template.sections) {
                for (let i = 0; i < template.sections.length; i++) {
                    let section = template.sections[i];

                    let newSection = await Section.create({
                        template_id: newTemplate.id,
                        title: section.title,
                        description: section.description,
                        order: section.order,
                    }).fetch();

                    await sails.helpers.savePuzzles(
                        section.puzzles,
                        newTemplate.id,
                        newSection.id,
                        null
                    );
                }
            }

            if (template.puzzles) {
                await sails.helpers.savePuzzles(template.puzzles, newTemplate.id, null, null);
            }

            return exits.success({ success: 1, template_id: newTemplate.id });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
