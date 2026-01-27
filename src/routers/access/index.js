"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { apiKey, permissions } = require("../../auth/checkAuth");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication, authenticationv2 } = require("../../auth/authUtils");
const router = express.Router();

// Áp dụng middleware kiểm tra API key cho tất cả route
router.use(apiKey);

// signup
router.post( "/shop/signup", asyncHandler(accessController.signUp),);

// signin
router.post( "/shop/signin", asyncHandler(accessController.login),);

// authentication
router.use(authenticationv2);
router.post( "/shop/logout", asyncHandler(accessController.logout),);
router.post( "/shop/handleRefreshToken", asyncHandler(accessController.handleRefreshToken),);

module.exports = router;
