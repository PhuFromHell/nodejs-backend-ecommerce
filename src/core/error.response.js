'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201
};

const ReasonStatusCode = {
    FORBIDDEN: 'Forbidden Error',
    CONFLICT: 'Conflict Request Error',
    BAD_REQUEST: 'Bad Request Error',
    UNAUTHORIZED: 'Unauthorized Error',
}


class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.BAD_REQUEST, statusCode = StatusCode.BAD_REQUEST) {
        super(message, statusCode);
    }
}
module.exports = {
    ConflictRequestError,
    BadRequestError,
    StatusCode,
    ReasonStatusCode
};