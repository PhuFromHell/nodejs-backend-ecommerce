'use strict';

const { Schema, model } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const PRODUCT_TYPE = ["Electronics", "Clothing", "Books", "Home", "Beauty", "Sports", "Toys", "Grocery", "Furniture", "Automotive"];

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: PRODUCT_TYPE },
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  product_attributes: { type: Schema.Types.Mixed, required: true },
}, {
  collection: COLLECTION_NAME,
  timestamps: true,
});

// define the product type = clothing
const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
}, {
  collection: 'clothes', timestamps: true 
});

// define the product type = electronics
const electronicsSchema = new Schema({
  manufacturer: { type: String, required: true },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
}, {
  collection: 'electronics', timestamps: true
});

// define the product type = furniture
const furnitureSchema = new Schema({
  manufacturer: { type: String, required: true },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
}, {
  collection: 'furnitures', timestamps: true
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronics: model('Electronics', electronicsSchema),
  furniture: model('Furniture', furnitureSchema)
};