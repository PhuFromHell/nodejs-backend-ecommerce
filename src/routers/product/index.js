"use strict";

const express = require("express");
const router = express.Router();
const { apiKey } = require("../../auth/checkAuth");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");


router.use(apiKey);

// authentication
router.use(authenticationV2);
router.post( '', asyncHandler(productController.createProduct));

module.exports = router;
