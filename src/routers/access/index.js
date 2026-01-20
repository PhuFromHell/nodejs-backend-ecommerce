'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();


// signup
router.post('/shop/signup', accessController.signUp);

// signin
router.post('/signin', (req, res) => {
    return res.status(200).json({
        message: 'Signin endpoint'
    });
}); 

module.exports = router;
