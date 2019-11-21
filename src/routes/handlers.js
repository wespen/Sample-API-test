/**
 * Handlers for routes
 * Connects DB services to req data
 */
const service = require('../service');

// Folders handlers
async function createFolderHandler(req) {
  const { name, folderId } = req.body;
  const data = await service.createFolder(name, folderId);
  return { success: data };
}
async function deleteFolderHandler(req) {
  const { resourceId } = req.body;
  const data = await service.deleteFolder(resourceId);
  return { success: data };
}
async function renameFolderHandler(req) {
  const { resourceId, newName } = req.body;
  const data = await service.renameFolder(resourceId, newName);
  return { success: data };
}

// Files handlers
async function createFileHandler(req) {
  const { name, folderId } = req.body;
  const data = await service.createFile(name, folderId);
  return { success: data !== null };
}
async function deleteFileHandler(req) {
  const { resourceId } = req.body;
  const data = await service.deleteFile(resourceId);
  return { success: data !== null };
}
async function renameFileHandler(req) {
  const { resourceId, newName } = req.body;
  const data = await service.renameFile(resourceId, newName);
  return { success: data !== null };
}

async function findFileHandler(req) {
  const { fileName, folder } = req.query;
  const data = await service.findFiles(fileName, folder);
  return data;
}

async function searchFileHandler(req) {
  const { fileName } = req.query;
  const data = await service.findFiles(fileName, null, false);
  return data;
}

module.exports = {
  createFolderHandler,
  deleteFolderHandler,
  renameFolderHandler,
  createFileHandler,
  deleteFileHandler,
  renameFileHandler,
  findFileHandler,
  searchFileHandler,
};
