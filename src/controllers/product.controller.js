'use strict'

const ProductService = require('../services/product.service');
const  { BadRequestError, ForbiddenError, SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    // const productInstance = await ProductService.createProduct(req.body.product_type, req.body);
    // const data = await productInstance.createProduct();
    new SuccessResponse({
      message: "Create new product success",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body,
      ),
    }).send(res);
  }
}

module.exports = new ProductController();