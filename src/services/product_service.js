const ProductModel = require("../models/product_model");

class ProductService {
  getAllProducts = async () => {
    return await ProductModel.find();
  };

  countStatus = async (status) => {
    if (status) {
      return await ProductModel.countDocuments({ status });
    } else {
      return await ProductModel.countDocuments();
    }
  };
}

module.exports = new ProductService();
