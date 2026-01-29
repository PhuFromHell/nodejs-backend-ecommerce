"use strict";

const jwt = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler.js");
const { head } = require("lodash");
// service
const {findByUserId} = require("../services/keytoken.service.js");
const { AuthFailureError, NotFoundError } = require("../core/error.response.js");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "x-refresh-token",
};

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

const authentication = asyncHandler(async (req, res, next) => {
  // Logic authentication
  // 1. check userId missing
  // 2. get accessToken from header
  // 3. verify token
  // 4. check token in db
  // 5. check key store with userId
  // 6. return next()

  // step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }

  // step 2: get accessToken from header
  const keyStore = await findByUserId(userId);
  if (!keyStore) {
    throw new NotFoundError("Not found key store");
  }

  // step 3: verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }

  // step 4: check token in db
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid request userid");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    console.log("error verify token:", error);
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  // step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) {
    throw new AuthFailureError("Invalid request");
  }

  // step 2: get accessToken from header
  const keyStore = await findByUserId(userId);
  console.log("🚀 ~ keyStore:", keyStore)
  if (!keyStore) {
    throw new NotFoundError("Not found key store");
  }

  // step 3: verify token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid request userid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }


  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid request");
  }

  // step 4: check token in db
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid request userid");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    console.log("error verify token:", error);
  }
});

const authenticationv2 = asyncHandler(async (req, res, next) => {
  // Logic authentication
  // 1. check userId missing
  // 2. get accessToken from header
  // 3. verify token
  // 4. check token in db
  // 5. check key store with userId
  // 6. return next()

  // step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  // step 2: get accessToken from header
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store");

  // step 3: verify token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);

      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid request userid");

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");

  // step 4: check token in db
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid request userid");

    req.keyStore = keyStore;
    // req.user = decodeUser;
    return next();
  } catch (error) {
    console.log("error verify token:", error);
  }
});

const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, authenticationV2, verifyJWT };
