"use strict";

const mongoose = require("mongoose");
const { set } = require("../app");

const os = require("os");
const process = require("process");

const _SECONDS = 5 * 1000; // 5 seconds
// đếm số kết nối mongoose hiện tại (count connections)
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of mongoose connections: ${numConnection}`);
  return numConnection;
};

// check overload connections
const checkOverloadConnections = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    console.log(`Number of CPU cores: ${numCores}`);
    console.log(`Memory Usage: `, memoryUsage);

    const maxConnections = numCores * 5; // mỗi core cho phép 5 connections
    console.log(`num connections allowed = ${maxConnections}`);
    console.log(
      `memory Usage = ${memoryUsage / 1024 / 1024} MB, maxConnections = ${maxConnections}`,
    );

    if (numConnection > maxConnections) {
      console.log(
        `Overload connections detected! Current: ${numConnection}, Max allowed: ${maxConnections}`,
      );
      console.log(`connection overload detected...`);
      // thực hiện các hành động khắc phục, ví dụ: gửi cảnh báo, tái khởi động kết nối, v.v.
    }
  }, _SECONDS); // mỗi 5 seconds check một lần
};

module.exports = {
  countConnect,
  checkOverloadConnections,
};
