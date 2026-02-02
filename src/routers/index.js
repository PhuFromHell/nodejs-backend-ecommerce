"use strict";

const express = require("express");
const { keyBy } = require("lodash");
const { apiKey, permissions } = require("../auth/checkAuth");
const router = express.Router();

// check api keyBy
router.use(apiKey);
// check Permissions
router.use(permissions("0000"));

// access router
router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
