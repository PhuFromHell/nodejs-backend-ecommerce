"use strict";

const shopModel = require("../models/shop.model");

const findByEmail = async ({ email, select = { email: 1, password: 1, name: 1, status: 1, roles: 1, }}) => {
  // logic to find shop by email from database
  return await shopModel.findOne({ email }).select(select).lean(); // Giả sử shopModel đã được định nghĩa và kết nối với cơ sở dữ liệu
};

module.exports = { findByEmail };
