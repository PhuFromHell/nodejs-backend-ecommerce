"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { apiKey, permissions } = require("../../auth/checkAuth");

// authentication
router.use(authentication);

// create product
router.post( "", asyncHandler(productController.createProduct),);

module.exports = router;
