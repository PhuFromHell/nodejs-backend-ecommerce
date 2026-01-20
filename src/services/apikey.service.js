'use strict';

const apikeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findById = async ( key ) => {
    // const newkey = await apikeyModel.create({ key: crypto.randomBytes(64).toString("hex"), status: true, permissions: ['0000'] });
    // console.log("New Key Created:", newkey);
    const objApiKey = await apikeyModel.findOne({
        key: key,
        status: true
    }).lean();

    return objApiKey;
}
module.exports = { findById };