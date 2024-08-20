const MainModel = require("../models/category_model");
const ProductModel = require("../models/product_model");
class CategoryService {
  getEleById = async (id) => {
    return await MainModel.findById(id);
  };
  saveItem = async ({ name, slug, status, ordering, menu_id }) => {
    await MainModel.create({
      name: String(name),
      slug,
      status,
      ordering,
      menu_id: menu_id || null,
    });
  };

  getAllItems = async (filter) => {
    return await MainModel.find(filter);
  };
  deleteItemById = async (id) => {
    return await MainModel.findByIdAndDelete(id);
  };
  updateItemById = async (id, updatedData) => {
    // updatedData.name = String(updatedData.name);
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
  getAllCategories = async () => {
    return await MainModel.find({ status: "active" });
  };
  getAllCategoriesOrdered = async () => {
    return await MainModel.find({ status: "active" }).sort({
      ordering: -1,
    });
  };
  getCategoryByMenuId = async (menuId) => {
    return await MainModel.find({
      menu_id: menuId,
      status: "active",
    });
  };
  getProductsByCategoryId = async (categoryId) => {
    const products = await ProductModel.find({ category_id: categoryId });
    return products;
  };
}
module.exports = new CategoryService();
