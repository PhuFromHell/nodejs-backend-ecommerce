"use strict";
const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongdb");

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = "mongoodb") {
    // dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => console.log("Connected to MongoDB"))
      .catch((err) => console.error("MongoDB connection error:", err));
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
  }
}

const instance = Database.getInstance();
module.exports = instance;
