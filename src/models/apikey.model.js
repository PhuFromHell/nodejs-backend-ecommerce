'use strict';
 
// key !dmbg install  by mongo snippet for nodejs

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'apiKeys';

// Define the schema for API keys
const apikeySchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true,
        enum: [true, false]
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222', '3333']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, apikeySchema);