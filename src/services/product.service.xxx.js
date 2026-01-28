"use strict";

const { models } = require("mongoose");

const { product, clothing, electronics, furniture } = require("../models/product.model.js");
const { BadRequestError } = require("../core/error.response.js");

// Factory class để tạo product
class ProductService {

  static productRegistry = {} // key-class value

  static registerProductType( type, classRef) {
    ProductService.productRegistry[type] = classRef
  }

  static async createProduct( type, payload ) {
    const productClass = ProductService.productRegistry[type];
    if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`);

    return new productClass(payload).createProduct();
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
  async createProduct( product_id ) {
    return await product.create({
      ...this,
      _id: product_id
    });
  }
}

// Sub-class cho product type Clothing
class Clothing extends Product {
  async createProduct() {
    // Validate clothing attributes
    const newClothing = new clothing(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create clothing product failed");

    // Lưu product chính vào database
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create product failed");
    return newProduct;
  }
}

// Sub-class cho product type Electronics
class Electronics extends Product {
  // Override method createProduct
  async createProduct() {
    const newElectronics = await electronics.create({
      ...this.product_attributes, 
      product_shop: this.product_shop
    });
    if (!newElectronics) throw new BadRequestError("Create electronics product failed");

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) throw new BadRequestError("Create product failed");
    return newProduct;
  }
}


// Sub-class cho product type Furniture
class Furniture extends Product {
  // Override method createProduct
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes, 
      product_shop: this.product_shop
    });
    if (!newFurniture) throw new BadRequestError("Create furniture product failed");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create product failed");
    return newProduct;
  }
}

// register product types
ProductService.registerProductType("Clothing", Clothing);
ProductService.registerProductType("Electronics", Electronics);
ProductService.registerProductType("Furniture", Furniture);

module.exports = ProductService;