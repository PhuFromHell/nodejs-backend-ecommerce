'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const { apiKey, asyncHandler, permissions } = require('../../auth/checkAuth');
const router = express.Router();

// Áp dụng middleware kiểm tra API key cho tất cả route
router.use(apiKey);

// signup
router.post('/shop/signup', accessController.signUp);

// signin
router.post('/signin', (req, res) => {
    return res.status(200).json({
        message: 'Signin endpoint'
    });
}); 

module.exports = router;
