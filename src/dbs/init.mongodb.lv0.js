'use strict';

// db = db.getSiblingDB('lv0_db');
const mongoose = require('mongoose');

const connectString = `mongodb://localhost:27017/shopDEV`;
mongoose.connect( connectString).then( _ => console.log('Connected to MongoDB') )
.catch( err => console.error('MongoDB connection error:', err) );

// dev
if (1 === 1) {
    mongoose.set('debug', true);
    mongoose.set('debug', { color: true });
}
module.exports = mongoose;