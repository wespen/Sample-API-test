/**
 * All microservice routes and handlers.
 * Request validation and responses are defined in JSON schemas
 */

const routeHandlers = require('./handlers');
const schema = require('./schemas');

module.exports = function allRoutes(fastify, opts, next) {
  // CRUD operations
  fastify.post('/file/create', { schema: schema.createResource }, routeHandlers.createFileHandler);
  fastify.post('/file/delete', { schema: schema.deleteResource }, routeHandlers.deleteFileHandler);
  fastify.post('/file/rename', { schema: schema.renameResource }, routeHandlers.renameFileHandler);

  // Search
  fastify.get('/file/find', { schema: schema.findResource }, routeHandlers.findFileHandler);
  fastify.get('/file/findInFolder', { schema: schema.findResource }, routeHandlers.findFileHandler);
  fastify.get('/file/search', { schema: schema.findResource }, routeHandlers.searchFileHandler);

  next();
};
