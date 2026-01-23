"use strict";

const { models } = require("mongoose");

const { product, clothing, electronics,} = require("../models/product.model.js");
const { BadRequestError } = require("../core/error.response.js");

// Factory class để tạo product
class ProductService {
  // Tạo product dựa trên type (Electronics, Clothing, ...)
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Electronics(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

// Base class cho tất cả product types
class Product {
  constructor(payload) {
    this.product_name        = payload.product_name;
    this.product_thumb       = payload.product_thumb;
    this.product_description = payload.product_description;
    this.product_price       = payload.product_price;
    this.product_quantity    = payload.product_quantity;
    this.product_type        = payload.product_type;
    this.product_shop        = payload.product_shop;
    this.product_attributes  = payload.product_attributes;
  }

  // Tạo product instance mới trong database
  async createNewProduct() {
    return await product.create(this);
  }
}

// Sub-class cho product type Clothing
class Clothing extends Product {
  async createProduct() {
    // Validate clothing attributes
    const newClothing = new clothing(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("Create clothing product failed");
    }

    // Lưu product chính vào database
    const newProduct = await super.createNewProduct();
    if (!newProduct) {
      throw new BadRequestError("Create product failed");
    }
    return newProduct;
  }
}

// Sub-class cho product type Electronics
class Electronics extends Product {
  async createProduct() {
    // Validate electronics attributes
    const newElectronics = new electronics(this.product_attributes);
    if (!newElectronics) {
      throw new BadRequestError("Create electronics product failed");
    }

    // Lưu product chính vào database
    const newProduct = await super.createNewProduct();
    if (!newProduct) {
      throw new BadRequestError("Create product failed");
    }
    return newProduct;
  }
}

module.exports = ProductService;