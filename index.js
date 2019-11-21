/**
 * TB API test Main entry point
 * connects to DB, and starts the server
 */

// check env vars for starting
if (!process.env.MONGO_URI) {
  throw new Error('Env vars not set. Exiting');
}
const _env = process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'test' ? 'development' : process.env.NODE_ENV;

const fastify = require('fastify');
const { errorTypes } = require('./src/error');
// load routes
const dbModels = require('./src/db/_db');

// Simplifed package version fetch for now
const { version } = require('./package.json');

// Init logger
console.info('Service starting');

// Init server
const server = fastify(
  {
    caseSensitive: false,
    trustProxy: true,
    // add req/res logger in development
    logger: _env === 'development' ? console : false,
  },
);


// set development options
if (_env === 'development') {
  const swaggerOption = {
    routePrefix: '/swagger',
    swagger: {
      info: {
        title: 'Test Microservice swagger',
        description: 'Test microservice API details',
        version,
      },
      // host: 'localhost',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
    exposeRoute: true,
  };
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  server.register(require('fastify-swagger'), swaggerOption);
}

const start = async () => {
  // Init DB connections on startup
  console.info('Connecting to DB');
  await dbModels.connect();

  // Load routes after DB is connected
  // eslint-disable-next-line global-require
  const filesRoutes = require('./src/routes/files');
  // eslint-disable-next-line global-require
  const foldersRoutes = require('./src/routes/folders');
  server.register(filesRoutes);
  server.register(foldersRoutes);

  // Register default routes
  server.get('/', async (request, reply) => {
    reply
      .code(200)
      .send('Truebase Test Microservice running');
  });
  // add alive and ready routes
  server.get('/health', async (request, reply) => {
    reply
      .code(200)
      .send({ alive: true });
  });
  server.get('/readiness', async (request, reply) => {
    if (dbModels.isConnected()) {
      return reply
        .code(200)
        .send({ ready: true });
    }
    return reply
      .code(503)
      .send({ ready: false });
  });
  try {
    console.info('Starting Server');
    // print routes in development
    await server.listen(process.env.PORT || 3000, _env === 'development' ? 'localhost' : '0.0.0.0');
    console.info(`Server listening on ${server.server.address().address}:${server.server.address().port}`);
    if (_env === 'development') {
      server.ready((err) => {
        if (err) throw err;
        server.swagger();
      });
    }
  } catch (err) {
    console.error(err.stack, { type: errorTypes.SERVER_ERROR.name });
    process.exit(1);
  }
  return server;
};

// start the service if not in test mode
if (process.env.NODE_ENV !== 'test') {
  start();
}

process.on('SIGINT', async () => {
  console.log('stopping server');
  await server.close();
  process.exit(0);
});

module.exports = start;
