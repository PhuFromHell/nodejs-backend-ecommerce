"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { apiKey, permissions } = require("../../auth/checkAuth");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

// Áp dụng middleware kiểm tra API key cho tất cả route
router.use(apiKey);

// signup
router.post(
  "/shop/signup",
  permissions("0000"),
  asyncHandler(accessController.signUp),
);

// signin
router.post(
  "/shop/signin",
  permissions("0000"),
  asyncHandler(accessController.login),
);

// authentication
router.use(authentication);
router.post(
  "/shop/logout",
  permissions("0000"),
  asyncHandler(accessController.logout),
);

module.exports = router;
