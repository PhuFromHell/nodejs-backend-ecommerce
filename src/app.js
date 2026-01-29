require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);

// init middleware
app.use(morgan("dev")); // dùng để log các request đến server
// app.use(morgan('combined')); // log chi tiết hơn với định dạng combined
// app.use(morgan('common')); // log với định dạng common
// app.use(morgan('short')); // log với định dạng short
// app.use(morgan('tiny')); // log với định dạng tiny
app.use(helmet()); // bảo vệ app bằng cách thiết lập các header HTTP
app.use(compression()); // nén response để tăng tốc độ truyền tải dữ liệu

app.use(express.json()); // phân tích cú pháp JSON trong body của request

// init db
// require('./dbs/init.mongodb.js');
require("./dbs/init.mongodb");
// const { countConnect, checkOverloadConnections } = require('./helpers/check.connect');
// countConnect();
// checkOverloadConnections();

// init routes
app.use("/", require("./routers/index"));

// handling errors
// hàm middleware xử lý lỗi
// hàm này sẽ được gọi khi không tìm thấy route phù hợp
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// hàm quản lý lỗi error-handling middleware
// hàm này dùng để xử lý tất cả các lỗi được truyền đến nó
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  console.log("🚀 ~ err.status:", err)
  console.log("🚀 ~ statusCode:", statusCode);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
    stack: err.stack || "",
    metadata: null,
  });
});

module.exports = app;
