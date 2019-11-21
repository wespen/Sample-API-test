/**
 * DB service uses models to fetch and save data to DB.
 * Data validation and transformation is done in route handlers
 */

const dbModels = require('./db/_db');
const { errorTypes, APIerror } = require('./error');

const { Files, Folders } = dbModels.getModels();

// Helper function ************************************
/**
 * Validate folder ID
 * @param {String} folderId id of a folder to find
 */
async function validateFolder(folderId) {
  const doc = await Folders.findOne({ _id: folderId }).lean().exec();
  if (!doc) {
    return false;
  }
  return true;
}

/**
 * Validate file ID
 * @param {String} fileId id of a file to find
 */
async function validateFile(fileId) {
  const doc = await Files.findOne({ _id: fileId }).lean().exec();
  if (!doc) {
    return false;
  }
  return true;
}

// DB operations ************************************
async function createFolder(name, folderId) {
  // TODO check for duplicates?
  const newFolder = new Folders();
  newFolder.name = name;
  // set tree if parent is set
  if (folderId) {
    const folderExists = await validateFolder(folderId);
    if (folderExists !== true) {
      throw new APIerror(errorTypes.DATA_NOT_VALID);
    }

    const data = await Folders.findOneAndUpdate({ _id: folderId },
      { $addToSet: { children: newFolder._id } },
      {
        new: true,
        upsert: false,
        runValidators: true,
      }).exec();
    if (!data) {
      throw new APIerror(errorTypes.DB_ERROR);
    }
  }

  const doc = await newFolder.save();
  if (!doc) {
    return false;
  }
  return true;
}

async function deleteFolder(folderId) {
  const folderExists = await validateFolder(folderId);
  if (folderExists !== true) {
    throw new APIerror(errorTypes.DATA_NOT_VALID);
  }
  const data = await Folders.findByIdAndRemove(folderId);
  // TODO check if we need to delete all subfolders

  if (!data) {
    return false;
  }
  return true;
}

async function renameFolder(folderId, newName) {
  const folderExists = await validateFolder(folderId);
  if (folderExists !== true) {
    throw new APIerror(errorTypes.DATA_NOT_VALID);
  }

  const data = await Folders.findOneAndUpdate({ _id: folderId },
    {
      $set: {
        name: newName,
      },
    },
    {
      new: false,
      upsert: true,
      runValidators: true,
    }).exec();
  if (!data) {
    return false;
  }
  return true;
}

// File DB operations
async function createFile(name, folderId) {
  const newFile = new Files();
  newFile.name = name;
  // set tree if parent is set
  if (folderId) {
    const folderExists = await validateFolder(folderId);
    if (folderExists !== true) {
      throw new APIerror(errorTypes.DATA_NOT_VALID);
    }
    newFile.folder = folderId;
  }

  const doc = await newFile.save();
  if (!doc) {
    return false;
  }
  return true;
}

async function deleteFile(fileId) {
  const fileExists = await validateFile(fileId);
  if (fileExists !== true) {
    throw new APIerror(errorTypes.DATA_NOT_VALID);
    // TODO ili vratiti return false;
  }
  const data = await Files.findByIdAndRemove(fileId);
  if (!data) {
    return false;
  }
  return true;
}

async function renameFile(fileId, newName) {
  const fileExists = await validateFile(fileId);
  if (fileExists !== true) {
    throw new APIerror(errorTypes.DATA_NOT_VALID);
  }

  const data = await Files.findOneAndUpdate({ _id: fileId },
    {
      $set: {
        name: newName,
      },
    },
    {
      new: false,
      upsert: true,
      runValidators: true,
    }).exec();
  if (!data) {
    return false;
  }
  return true;
}

async function findFiles(fileName, folderId, exactMatch = true) {
  let foundFiles = [];
  // exact match search
  if (exactMatch) {
    const fileQuery = Files
      .where('name', fileName);
    if (folderId) {
      fileQuery
        .where('folder', folderId);
    }
    foundFiles = await fileQuery.lean().exec();
    return foundFiles;
  }
  foundFiles = await Files
    .where('name', new RegExp(`^${fileName}`, 'i'))
    .limit(10)
    .lean().exec();
  return foundFiles;
}

module.exports = {
  createFolder,
  deleteFolder,
  renameFolder,
  createFile,
  deleteFile,
  renameFile,
  findFiles,
};
