'Use strict';

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'
};

const { rearg } = require('lodash');
const {findById} = require('../services/apikey.service');

const apiKey = async (req, res, next) => {
    try {
        // Logic to check API key from request headers
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({ message: 'Forbidden error' });
        }

        // check in database
        const objApiKey = await findById(key);
        if (!objApiKey) {
            return res.status(403).json({ message: 'Forbidden error' });
        }

        req.objApiKey = objApiKey;
        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const permissions = (permissions) => {
    return (req, res, next) => {

        if (!req.objApiKey.permissions) {
            return res.status(403).json({ message: '0 permission denied' });
        }

        const hasPermission = req.objApiKey.permissions.includes(permissions);
        if (!hasPermission) {
            return res.status(403).json({ message: '1 permission denied' });
        }
        return next();
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = { apiKey, permissions, asyncHandler };