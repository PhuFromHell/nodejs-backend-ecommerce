const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middleware
app.use(morgan('dev')); // dùng để log các request đến server
// app.use(morgan('combined')); // log chi tiết hơn với định dạng combined
// app.use(morgan('common')); // log với định dạng common
// app.use(morgan('short')); // log với định dạng short
// app.use(morgan('tiny')); // log với định dạng tiny
app.use(helmet()); // bảo vệ app bằng cách thiết lập các header HTTP
app.use(compression()); // nén response để tăng tốc độ truyền tải dữ liệu


// app.use(express.json()); // phân tích cú pháp JSON trong body của request



// init db
// require('./dbs/init.mongodb.js');
require('./dbs/init.mongodb')
const { countConnect } = require('./helpers/check.connect');
countConnect();
checkOverloadConnections();
// init routes
app.get('/', (req, res) => {
  // const strCompression = 'strCompression say Hello World!';
  return res.status(200).json({
    message: 'Hello World!',
    // metadata: strCompression.repeat(100000)
  });
});

// handling errors

module.exports = app;
