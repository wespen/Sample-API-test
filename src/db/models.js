/**
 * Create required models
 */

const filesSchema = require('./files');
const treeSchema = require('./folders');

module.exports = function createModels(connection) {
  const dbModels = {
    Files: connection.model('Files', filesSchema, 'files'),
    Folders: connection.model('Folders', treeSchema, 'folders'),
  };
  return dbModels;
};
