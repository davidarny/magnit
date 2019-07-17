module.exports = {
    friendlyName: "",

    description: ``,

    inputs: {
        offset: {
            type: "number",
            defaultsTo: 0,
        },
        limit: {
            type: "number",
            defaultsTo: 10,
        },
        sort: {
            type: "string",
            isIn: ["ASC", "DESC"],
            defaultsTo: "ASC",
        },
        title: {
            type: "string",
        },
    },

    exits: {
        notFound: {
            statusCode: 404,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            const offset = _.escape(inputs.offset);
            const limit = _.escape(inputs.limit);
            const sort = _.escape(inputs.sort);
            const title = _.escape(inputs.title);

            let criteria = {};

            if (title) {
                criteria.title = title;
            }

            const total = await Template.count(criteria);
            const templates = await Template.find(criteria)
                .skip(offset)
                .limit(limit)
                .sort([{ title: sort }]);

            for (let i = 0; i < templates.length; i++) {
                templates[i].assigned = false;

                let taskTemplatesCount = await TaskTemplate.find({ template_id: templates[i].id });

                if (taskTemplatesCount > 0) {
                    templates[i].assigned = true;
                }
            }

            return exits.success({ success: 1, total: total, templates: templates });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
