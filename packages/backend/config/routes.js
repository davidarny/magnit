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
    "GET /v1/templates": "v1/admin/get-templates",
    "POST /v1/templates": "v1/admin/create-template",
    "GET /v1/templates/:id": "v1/admin/get-template",
    "PUT /v1/templates/:id": "v1/admin/edit-template",
    "DELETE /v1/templates/:id": "v1/admin/delete-template",
};
