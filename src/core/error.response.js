"use strict";

const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode.js");

const STATUS_CODE = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
};

const REASON_STATUS_CODE = {
  FORBIDDEN: "Forbidden Error",
  CONFLICT: "Conflict Request Error",
  BAD_REQUEST: "Bad Request Error",
  UNAUTHORIZED: "Unauthorized Error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT,
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST,
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND,
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN,
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
};
