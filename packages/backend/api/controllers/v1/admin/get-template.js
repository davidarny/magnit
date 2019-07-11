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

            let json = {};

            let template = await Template.findOne({ id: id });

            if (!template) {
                return exits.notFound({ success: 0, message: "template does not exist" });
            }

            json.id = template.id;
            json.type = template.type;
            json.title = template.title;
            json.description = template.description;

            let sections = await Section.find({ template_id: template.id }).sort("order ASC");

            if (sections.length > 0) {
                json.sections = [];

                for (let i = 0; i < sections.length; i++) {
                    let section = sections[i];
                    json.sections.push({
                        id: section.id,
                        title: section.title,
                        description: section.description,
                        order: section.order,
                    });

                    let puzzlesWithoutParent = await Puzzle.find({
                        template_id: template.id,
                        section_id: section.id,
                        parent_id: null,
                    }).sort("order ASC");

                    if (puzzlesWithoutParent.length > 0) {
                        json.sections[i].puzzles = [];
                        let assembledPuzzles = await sails.helpers.assemblePuzzles(
                            puzzlesWithoutParent
                        );
                        json.sections[i].puzzles.push(...assembledPuzzles);
                    }
                }
            }

            let puzzlesWithoutSectionAndParent = await Puzzle.find({
                template_id: template.id,
                section_id: null,
                parent_id: null,
            }).sort("order ASC");

            if (puzzlesWithoutSectionAndParent.length > 0) {
                json.puzzles = [];
                let assembledPuzzles = await sails.helpers.assemblePuzzles(
                    puzzlesWithoutSectionAndParent
                );
                json.puzzles.push(...assembledPuzzles);
            }

            return exits.success({ success: 1, template: JSON.stringify(json) });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
