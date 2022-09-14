class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.operational = true;
    this.message = message;
    this.statusCode = statusCode;
    // this.stack = stack;
    this.status = String(statusCode).startsWith("4") ? "fail" : "failed";
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ApiError;
