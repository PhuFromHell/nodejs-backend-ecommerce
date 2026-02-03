'use strict'

const { product, clothing, electronics, furniture } = require('../models/product.model')
const  { BadRequestError, ForbiddenError } = require('../core/error.response');

// define Factory class to create product
class ProductFactory {

  static productRegistry = {} // key class

  static registerProductType ( type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload){
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError(`invalid product types ${type}`)
    return new productClass(payload).createProduct();
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

  async createProduct(product_id) {
    return await product.create({...this, _id: product_id });
  }
}

// Sub-class cho product type Clothing
class Clothing extends Product {
  async createProduct() {
    // Validate clothing attributes
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Clothing: Create clothing product failed");

    // Lưu product chính vào database
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Clothing: Create product failed");
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct(){
    const newElectronic = await electronics.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElectronic) throw new BadRequestError('Electronic: create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Electronic: create new Product Error');
    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct(){
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newFurniture) throw new BadRequestError('Furniture: create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Furniture: create new Product Error');
    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;