// Courtesy of http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
class BaseError extends Error {
  constructor(message, code) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.code = code || 500;

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}

class NotFoundError extends BaseError {
  constructor(message) {
    super(message, 404);
  }
}

module.exports = {
  NotFound: NotFoundError,
}
