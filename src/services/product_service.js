const MainModel = require("../models/product_model");

class MainService {
  getEleById = async (id) => {
    return await MainModel.findById(id);
  };
  saveItem = async (productData) => {
    return await MainModel.create(productData);
  };
  getAllItems = async (filter) => {
    return await MainModel.find(filter);
  };
  deleteItemById = async (id) => {
    return await MainModel.findByIdAndDelete(id);
  };
  updateItemById = async (id, updatedData) => {
    const item = await MainModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return item;
  };
  countStatus = async (name = "") => {
    //
    let status = {};
    if (name != "") status = { status: name };
    return await MainModel.countDocuments(status);
  };
  findItem = async (searchTerm, filter) => {
    const test = await MainModel.find({
      ...filter,
      $or: [{ name: { $regex: new RegExp(searchTerm, "ig") } }],
    });
    // console.log(searchTerm, filter, test);
    return test;
  };
  getProductsByCategoryId = async (categoryId) => {
    return await MainModel.find({
      category_id: categoryId,
      status: "active",
    });
  };
  findBySlug = async ({ slug }) => {
    return await MainModel.findOne({ slug });
  };
  findByParam = async (params) => {
    return await MainModel.find(params);
  };
  // lấy tất cả sản phẩm đặc biệt render
  getProductIsSpecial = async () => {
    return await MainModel.find({
      isSpecial: true,
    });
  };
}
module.exports = new MainService();
