'use strict';

const { set } = require("lodash");
const { Schema, model, Types } = require("mongoose");
const slugify = require('slugify')

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const PRODUCT_TYPE = ["Electronics", "Clothing", "Books", "Home", "Beauty", "Sports", "Toys", "Grocery", "Furniture", "Automotive"];

const productSchema = new Schema({
  product_name: { type: String, required: true },
  product_thumb: { type: String, required: true },
  product_description: String,
  product_slug: String,
  product_price: { type: Number, required: true },
  product_quantity: { type: Number, required: true },
  product_type: { type: String, required: true, enum: PRODUCT_TYPE },
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop",},
  product_attributes: { type: Schema.Types.Mixed, required: true },
  // more
  product_ratingsAverage:{
    type: Number, 
    default: 4.5, 
    min: [1, 'rating must be above 1.0'],
    max: [5, 'rating must be above 5.0'],
    // 4.3333333333 => 4.3
    set: (val) => Math.round(val * 10) / 10,
    product_variation: { type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublished: {type: Boolean, default: false, index: true, select: false}
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true,
});

// productSchema.pre('save', function ( next ) {
//   this.product_slug = slugify(this.product_name, { lower: true });
//   next();
// });
productSchema.pre('save', async function () {
  this.product_slug = slugify(this.product_name, { lower: true });
});

// define the product type = clothing
const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
  collection: 'clothes', timestamps: true 
});

// define the product type = electronics
const electronicsSchema = new Schema({
  manufacturer: { type: String, required: true },
  model: String,
  color: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
  collection: 'electronics', timestamps: true 
});

// define the product type = Funiture
const furnitureSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String,
  product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
}, {
  collection: 'furnitures', timestamps: true 
});

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model('Clothing', clothingSchema),
  electronics: model('Electronics', electronicsSchema),
  furniture: model('Funiture', furnitureSchema),
};
