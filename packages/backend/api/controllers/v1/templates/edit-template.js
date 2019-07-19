module.exports = {
    friendlyName: "",

    description: ``,

    inputs: {
        id: {
            type: "number",
            required: true,
        },
        template: {
            type: "json",
            required: true,
        },
    },

    exits: {
        notFound: {
            statusCode: 404,
        },
        forbidden: {
            statusCode: 403,
        },
        badRequest: {
            statusCode: 400,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            const request = require("request");
            const fs = require("fs");
            const config = JSON.parse(fs.readFileSync("config.json"), "UTF-8");
            const moment = require("moment");
            const id = _.escape(inputs.id);
            let templateJSON = inputs.template;

            if (typeof templateJSON === "string") {
                const valid = await sails.helpers.isJsonValid(templateJSON);

                if (!valid) {
                    return exits.badRequest({ success: 0, message: "Not valid JSON" });
                }

                templateJSON = JSON.parse(templateJSON);
            }

            const template = await Template.findOne({ id: id });

            if (!template) {
                return exits.notFound({ success: 0, message: "template does not exist" });
            }

            const tasksWithTemplates = await TaskTemplate.find({ template_id: template.id });

            if (tasksWithTemplates.length > 0) {
                return exits.forbidden({
                    success: 0,
                    message: "template assigned to task; editing impossible",
                });
            }

            const host = config.host;
            const options = {
                uri: `${host}/v1/templates/${template.id}`,
                method: "DELETE",
            };

            request(options, async err => {
                if (err) {
                    console.log(err);
                }

                const options = {
                    uri: `${host}/v1/templates`,
                    method: "POST",
                    json: {
                        template: templateJSON,
                        template_id: template.id,
                        created_at: moment(template.createdAt).format(),
                    },
                };

                request(options, async err => {
                    if (err) {
                        console.log(err);
                    }

                    return exits.success({ success: 1 });
                });
            });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
