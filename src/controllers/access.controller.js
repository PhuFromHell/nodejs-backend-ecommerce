"use strict";

const AccessService = require("../services/access.service");

// AcceptedResponse = OK, CreatedResponse = created
const {
  AcceptedResponse,
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");
const { keys } = require("lodash");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Shop: Get new access token successfully",
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken,),
    // }).send(res);

    // version 2
    console.log("🚀 ~ AccessController ~ req.keyStore:", req.keyStore)
    new SuccessResponse({
      message: "Shop: Get new access token successfully",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      message: "SHOP: Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    new CreatedResponse({
      message: "SHOP: User created successfully",
      metadata: await AccessService.signUp(
        req.body.name,
        req.body.email,
        req.body.password,
      ),
      options: { limit: 10 },
    }).send(res);
  };

  logout = async (req, res, next) => {
    new AcceptedResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
}


module.exports = new AccessController();
