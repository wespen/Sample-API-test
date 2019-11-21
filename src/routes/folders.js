/**
 * All microservice routes and handlers.
 * Request validation and responses are defined in JSON schemas
 */

const routeHandlers = require('./handlers');
const schema = require('./schemas');

module.exports = function allRoutes(fastify, opts, next) {
  // CRUD operations
  fastify.post('/folder/create', { schema: schema.createResource }, routeHandlers.createFolderHandler);
  fastify.post('/folder/delete', { schema: schema.deleteResource }, routeHandlers.deleteFolderHandler);
  fastify.post('/folder/rename', { schema: schema.renameResource }, routeHandlers.renameFolderHandler);

  next();
};
