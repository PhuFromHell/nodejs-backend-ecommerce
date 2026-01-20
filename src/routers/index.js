'use strict';

const express = require('express');
const router = express.Router();

// access router
router.use('/v1/api', require('./access'));

module.exports = router;