"use strict";

const jwt = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    // refresh token
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // json web token
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`Error verify::`, err);
      } else {
        console.log(`Decode verify::`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

// const { DataTypes, Model } = require('sequelize');
// const sequelize = require('../config/sequelize');

module.exports = { createTokenPair };
