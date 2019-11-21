/**
 * Typed errors used throught thecode.
 * DO NOT ALTER WITHOUT PERMISSION!!!!!
 */

exports.errorTypes = {
  SERVER_ERROR: {
    name: 'SERVER_ERROR',
    message: 'Error Starting server',
    status: 500,
  },
  DB_ERROR: {
    name: 'DB_ERROR',
    message: 'Error connecting to database',
    status: 500,
  },
  NOT_FOUND: {
    name: 'NOT_FOUND',
    message: 'User not found',
    status: 404,
  },
  DATA_NOT_VALID: {
    name: 'DATA_NOT_VALID',
    message: 'provided data is not valid',
    status: 400,
  },
  ALREADY_EXISTS: {
    name: 'ALREADY_EXISTS',
    message: 'provided email already exists',
    status: 403,
  },
};

class APIerror extends Error {
  /**
   *  API error class
   * @param {Error} errorTypesObject accepts Error or errorTypes object
   */
  constructor(errorTypesObject) {
    super(errorTypesObject.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.status = errorTypesObject.status || 500;
    this.type = errorTypesObject.name;
  }

  status() {
    return this.status;
  }

  type() {
    return this.type;
  }

  toString() {
    return {
      type: this.type,
      message: this.message,
    };
  }
}

exports.APIerror = APIerror;
