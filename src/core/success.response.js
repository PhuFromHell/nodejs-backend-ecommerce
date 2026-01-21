"use strict";

const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
};

class CuccessResponse {
  constructor({
    message = "Success",
    status = "success",
    code = 200,
    metadata = null,
  }) {
    this.message = message;
    this.status = status;
    this.code = code;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.code).json({
      message: this.message,
      status: this.status,
      metadata: this.metadata,
    });
  }
}
