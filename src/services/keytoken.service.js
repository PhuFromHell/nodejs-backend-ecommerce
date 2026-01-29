"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return tokens ? tokens.publicKey : null;

      // level 1
      const filters = { user: userId };
      const update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(filters, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.error("Error creating key token:", error);
      throw error;
    }
  };
  
  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  static findByRefreshTokensUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: new Types.ObjectId(userId) });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean();
  }

  static updateRefreshToken = async (id, refreshToken, refreshTokensUsed) => {
    return await keytokenModel.findByIdAndUpdate(
      id,
      {
        $set: { refreshToken },
        $addToSet: { refreshTokensUsed: refreshTokensUsed }
      },
      { new: true }
    );
  };
}
module.exports = KeyTokenService;
