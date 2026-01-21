"use strict";

const accessService = require("../services/access.service");

// AcceptedResponse = OK, CreatedResponse = created
const {
  AcceptedResponse,
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "SHOP: Login successfully",
      metadata: await accessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CreatedResponse({
      message: "SHOP: User created successfully",
      metadata: await accessService.signUp(
        req.body.name,
        req.body.email,
        req.body.password,
      ),
      options: { limit: 10 },
    }).send(res);
  };
}

module.exports = new AccessController();
