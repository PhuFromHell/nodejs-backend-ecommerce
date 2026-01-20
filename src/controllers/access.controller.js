'use strict';

const accessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        try {

            /**?
             * 200 OK
             * 201 Created
             * 202 Accepted
             * 204 No Content
             */
            console.log(`[P]::signUp::`, req.body);
            return res.status(201).json(await accessService.signUp(req.body.name, req.body.email, req.body.password));
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AccessController();