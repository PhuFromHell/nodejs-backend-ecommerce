"use strict";

const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

const REASON_STATUS_CODE = {
  SUCCESS: "SUCCESS: The request has succeeded.",
  CREATED: "CREATED: The request has been fulfilled and resulted in a new resource being created.",
  ACCEPTED: "ACCEPTED: The request has been accepted for processing, but the processing has not been completed.",
  NO_CONTENT: "NO CONTENT: The server successfully processed the request, but is not returning any content.",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = STATUS_CODE.SUCCESS,
    reasonStatusCode = REASON_STATUS_CODE.SUCCESS,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class AcceptedResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    options,
    message,
    statusCode = STATUS_CODE.CREATED,
    reasonStatusCode = REASON_STATUS_CODE.CREATED,
    metadata,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = { SuccessResponse, AcceptedResponse, CreatedResponse };