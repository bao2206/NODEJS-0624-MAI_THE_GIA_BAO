const MainModel = require("../models/category_model");

class CategoryService {
  getEleById = async (id) => {
    return await MainModel.findById(id);
  };
  saveItem = async (name, status, ordering) => {
    console.log(name, status, ordering);
    await MainModel.create({
      name,
      ordering,
      status,
    });
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
}
module.exports = new CategoryService();
