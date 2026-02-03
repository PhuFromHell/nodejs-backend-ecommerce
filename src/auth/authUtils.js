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
    // Create access token: short-lived token for authentication
    const accessToken = await jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // Create refresh token: long-lived token for renewing access token
    const refreshToken = await jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // Optional: Verify the newly created access token for debugging purposes
    // This ensures the token is valid immediately after creation
    jwt.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`Error verifying access token:`, err);
      } else {
        console.log(`Access token decoded successfully:`, decode);
      }
    });

    // Return the token pair
    return { accessToken, refreshToken };
  } catch (error) {
    // Handle any errors during token creation (e.g., invalid keys or payload)
    console.error("Error creating token pair:", error);
    throw error; // Re-throw to let caller handle
  }
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
  } catch (error) {
    console.log("error verify token:", error);
  }

  return next();
});

const authenticationV2 = asyncHandler(async (req, res, next) => {

  // step 1: check userId missing
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  // step 2: get accessToken from header
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store"); 
  
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if ( refreshToken ) {
    try {
      const decodeUser = await jwt.verify(refreshToken, keyStore.privateKey);
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
  if (!accessToken) throw new AuthFailureError("invalid request ");
  const token = accessToken.startsWith('Bearer ') ? accessToken.slice(7) : accessToken;
  try {
    const decodeUser = jwt.verify( token, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw  new AuthFailureError("invalid userId ");
    req.keyStore = keyStore
    req.user = decodeUser
    return next();
  } catch (error) {
    throw error;
  } 
});

const verifyJWT = async ( token, keySecret) => {
  return await jwt.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, authenticationV2, verifyJWT };
