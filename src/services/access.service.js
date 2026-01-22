"use strict";

const bcrypt = require("bcrypt");
const crypto = require("node:crypto");

const shopModel = require("../models/shop.model.js");
const KeyTokenService = require("./keytoken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index.js");
const { findByEmail } = require("./shop.service.js");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response.js");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  /**
   * 1. check token used
   * 2. decode token to get user information
   * 2.1. if token used => clear key store (logout) and force re-login
   * 2.2. if token valid, then continue
   * 3. generate new token pair
   * 4. update token pair to db
   * 5. return token pair
   */
  handleRefreshToken = async (refreshToken) => {
    // step 1: check token used
    const foundTokenUsed =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    // nếu token đã bị sử dụng rồi
    if (foundTokenUsed) {
      // decode để xem là đứa nào dùng token này
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundTokenUsed.privateKey,
      );
      console.log(
        "🚀 1 ~ AccessService ~ handleRefreshToken ~ userId, email:",
        userId,
        email,
      );
      // xóa toàn bộ token trong database
      await KeyTokenService.removeKeyById(foundTokenUsed._id);
      throw new ForbiddenError("Something wrong happen. Please re-login");
    }

    // nếu token chưa bị sử dụng
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError("1 Shop not registered");
    }

    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey,
    );
    // check userId + email
    const foundShop = await findByEmail({ email });
    if (!foundShop || foundShop._id.toString() !== userId) {
      throw new AuthFailureError("2 Shop not registered");
    }
    // create new token pair
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );
    // update token store
    await KeyTokenService.updateRefreshToken(
      holderToken._id,
      tokens.refreshToken,
      refreshToken,
    );

    // step 5: return token pair
    return {
      user: { userId, email },
      tokens,
    };
  };

  // logout
  logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("🚀 ~ AccessService ~ delKey:", delKey);
    return delKey;
  };
  /*
   * 1. check email exist
   * 2. match password
   * 3. create accessToken, refreshToken and save to database
   * 4. generate tokens
   * 5. getInfoData return login data
   */
  login = async ({ email, password, refreshToken = null }) => {
    // step 1: check email exist
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("ERROR: Shop not registered");
    }

    // step 2: match password
    const isMatch = await bcrypt.compare(password, foundShop.password);
    if (!isMatch) {
      throw new AuthFailureError("ERROR: Authentication error");
    }

    // step 3: create accessToken, refreshToken and save to database
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    console.log(`publicKey: ${publicKey}`); // in ra dang chuoi PEM
    console.log(`privateKey: ${privateKey}`); // in ra dang chuoi PEM

    // step 4: generate tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey,
    );
    console.log("🚀 ~ AccessService ~ tokens:", tokens);

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey: publicKey,
      privateKey: privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData(["_id", "name", "email"], foundShop),
      tokens,
    };
  };

  signUp = async (name, email, password) => {
    // logic to save userData to database
    // step 1: check email exist
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("ERROR: Shop account already registered");
    }

    // step 2: save to db
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (!newShop || !newShop._id) {
      return {
        code: "50000",
        message: "Cannot create new shop account",
        status: "error",
      };
    }

    if (newShop) {
      // created privatgeKey and publicKey here (JWT, RSA, etc...)
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log(`publicKey: ${publicKey}`); // in ra dang chuoi PEM
      console.log(`privateKey: ${privateKey}`); // in ra dang chuoi PEM

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey: publicKey,
        privateKey: privateKey,
      });
      if (!keyStore) {
        return {
          code: "50001",
          message: "keyStore error",
          status: "error",
        };
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );
      console.log("🚀 ~ AccessService ~ tokens:", tokens);

      return {
        code: 201,
        message: "Shop account created successfully",
        status: "success",
        metadata: {
          shop: getInfoData(["_id", "name", "email", "password"], newShop),
          tokens,
        },
      };
    }
    return {
      code: "200",
      metadata: null,
    };
  };
}

module.exports = new AccessService();
