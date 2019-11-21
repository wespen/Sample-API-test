/**
 * Mongo DB connector
 * Returns prepared models
 */
const mongoose = require('mongoose');
const createModels = require('./models');

const _env = process.env.NODE_ENV === undefined ? 'development' : process.env.NODE_ENV;
mongoose.set('debug', _env === 'development');
const mongoOptions = {
  autoIndex: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: 120,
  poolSize: 10,
  socketTimeoutMS: 360000,
  useFindAndModify: false,
};

if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', true);
}
let connection;
let mongoURI;
function reconnect(error) {
  const time = process.env.DB_RECONNECT_INTERVAL || 5000;
  console.error(`Error connecting to database, retrying in ${time / 1000} seconds. Reported Error: ${error}`);
  setTimeout(() => {
    connection = mongoose.createConnection(mongoURI, mongoOptions);
  }, time);
}

/**
 * Connects to DB and returns models
 * @async
 * @param {String} connectionString Mongo URI
 * @returns {Object} Mongoose models
 */
async function connect(connectionString) {
  mongoURI = connectionString || process.env.MONGO_URI;
  connection = await mongoose.createConnection(mongoURI, mongoOptions);
  console.log(`DB connected: ${mongoURI}`);
  connection.on('error', reconnect);
  connection.on('disconnected', reconnect);
  return createModels(connection);
}

/**
 * Returns Mongoose models from connected DB
 * @returns {Object} Mongoose models
 * @throws {Error} If no connection to DB exists
 */
function getModels() {
  if (connection) {
    return createModels(connection);
  }
  throw new Error('Connect to DB using connect first');
}

/**
 * Returns true if DB is connected and available
 * @returns {Boolean} true if connected
 */
function isConnected() {
  return connection.readyState === 1;
}

exports.connect = connect;
exports.getModels = getModels;
exports.isConnected = isConnected;
