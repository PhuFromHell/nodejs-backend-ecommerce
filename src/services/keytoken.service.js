"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // level 1
      const filters = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filters,
        update,
        options,
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error("Error creating key token:", error);
      throw error;
    }
  };
}
module.exports = KeyTokenService;
