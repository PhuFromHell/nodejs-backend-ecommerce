'use strict'

const { product, clothing, electronics } = require('../models/product.model')
const  { BadRequestError, ForbiddenError } = require('../core/error.response');

// define Factory class to create product
class ProductFactory {
  static async createProduct(type, payload){
    switch (type) {
      case 'Electronics':
        return new Electronics(payload).createProduct();
      case 'Clothing':
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product type: ${type}`);
    }
  }
}

class Product {
  constructor ({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  };

  async createProduct() {
    return await product.create(this);
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

class Electronics extends Product {
  async createProduct(){
    const newElectronic = await electronics.create(this.product_attributes)
    if (!newElectronic) throw new BadRequestError('Electronic: create new Electronic error');

    const newProduct = await super.createProduct()
    if (!newProduct) throw new BadRequestError('Electronic: create new Product Error');
    return newProduct;
  }
}

module.exports = ProductFactory;