'use strict';

const accessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        return res.status(201).json(await accessService.signUp(req.body.name, req.body.email, req.body.password));
    };
}

module.exports = new AccessController();