/**
 * API data validation schemas
 */


const fileObject = {
  type: 'object',
  properties: {
    _id: { type: 'string', pattern: '^[0-9a-fA-F]{24}' },
    name: { type: 'string', pattern: '^[0-9a-fA-F]{24}' },
    folder: { type: 'string', pattern: '^[0-9a-fA-F]{24}' },
  },
};

const errorResponse = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    message: { type: 'string' },
  },
};

const createResource = {
  body: {
    type: 'object',
    required: ['name'],
    properties: {
      name: { type: 'string' },
      folderId: { type: 'string', pattern: '^[0-9a-fA-F]{24}' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
    '4xx': errorResponse,
  },
};

const deleteResource = {
  body: {
    type: 'object',
    required: ['resourceId'],
    properties: {
      resourceId: { type: 'string', pattern: '^[0-9a-fA-F]{24}' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
    '4xx': errorResponse,
  },
};

const renameResource = {
  body: {
    type: 'object',
    required: ['resourceId', 'newName'],
    properties: {
      resourceId: { type: 'string', pattern: '^[0-9a-fA-F]{24}' },
      newName: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
    '4xx': errorResponse,
  },
};

const findResource = {
  querystring: {
    type: 'object',
    required: ['fileName'],
    properties: {
      fileName: {
        type: 'string',
        minLength: 2,
      },
      folder: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}',
      },
    },
  },
  response: {
    '2xx': {
      type: 'array',
      items: fileObject,
    },
    '4xx': errorResponse,
  },
};

module.exports = {
  createResource,
  deleteResource,
  renameResource,
  findResource,
};
