/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
    // ████████╗███████╗███╗   ███╗██████╗ ██╗      █████╗ ████████╗███████╗███████╗
    // ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗██║     ██╔══██╗╚══██╔══╝██╔════╝██╔════╝
    //    ██║   █████╗  ██╔████╔██║██████╔╝██║     ███████║   ██║   █████╗  ███████╗
    //    ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██╔══██║   ██║   ██╔══╝  ╚════██║
    //    ██║   ███████╗██║ ╚═╝ ██║██║     ███████╗██║  ██║   ██║   ███████╗███████║
    //    ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════
    "GET /v1/templates": "v1/templates/get-templates",
    "POST /v1/templates": "v1/templates/create-template",
    "GET /v1/templates/:id": "v1/templates/get-template",
    "PUT /v1/templates/:id": "v1/templates/edit-template",
    "DELETE /v1/templates/:id": "v1/templates/delete-template",

    //  ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗███████╗
    // ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
    // ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   ███████╗
    // ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   ╚════██║
    // ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
    //  ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝
    "GET /v1/objects": "v1/objects/get-objects",

    // ██╗   ██╗███████╗███████╗██████╗ ███████╗
    // ██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
    // ██║   ██║███████╗█████╗  ██████╔╝███████╗
    // ██║   ██║╚════██║██╔══╝  ██╔══██╗╚════██║
    // ╚██████╔╝███████║███████╗██║  ██║███████║
    //  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝
    "GET /v1/users": "v1/users/get-users",

    // ████████╗ █████╗ ███████╗██╗  ██╗███████╗
    // ╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝██╔════╝
    //    ██║   ███████║███████╗█████╔╝ ███████╗
    //    ██║   ██╔══██║╚════██║██╔═██╗ ╚════██║
    //    ██║   ██║  ██║███████║██║  ██╗███████║
    //    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
    "POST /v1/tasks": "v1/tasks/create-task",
    "DELETE /v1/tasks/:id": "v1/tasks/delete-task",
    "GET /v1/tasks": "v1/tasks/get-tasks",
    "GET /v1/tasks/:id": "v1/tasks/get-task",
    "PUT /v1/tasks/:id": "v1/tasks/edit-task",
    "PUT /v1/tasks/:id/templates": "v1/tasks/add-templates",
};
