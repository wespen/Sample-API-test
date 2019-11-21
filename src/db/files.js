/**
 * Model for storing files
 */

const mongoose = require('mongoose');

const { ObjectId } = mongoose.SchemaTypes;

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    folder: { type: ObjectId, ref: 'Folders' },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = fileSchema;
