/**
 * Model for storing folder tree structure
 */

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    children: { type: Array, required: true, default: [] },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

module.exports = folderSchema;
