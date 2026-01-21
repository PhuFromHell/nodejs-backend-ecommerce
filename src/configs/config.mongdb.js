"use strict";

const app = require("../app");

// level 1
// dev environment and
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || "shopDEV",
    user: "",
  },
};
// production environment
const prd = {
  app: {
    port: process.env.PRD_APP_PORT || 3000,
  },
  db: {
    host: process.env.PRD_DB_HOST || "localhost",
    port: process.env.PRD_DB_PORT || 27017,
    name: process.env.PRD_DB_NAME || "shopPRD",
    user: "",
  },
};

const config = { dev, prd };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
