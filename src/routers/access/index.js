"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { apiKey, permissions, asyncHandler } = require("../../auth/checkAuth");
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

module.exports = router;
