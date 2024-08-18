const MainModel = require("../models/menu_model");
class MainService {
  getEleById = async (id) => {
    return await MainModel.findById(id);
  };
  saveItem = async (data) => {
    await MainModel.create(data);
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
    return test;
  };
  getAllMenu = async () => {
    return await MainModel.find({ status: "active" });
  };
  getAllMenuOrdered = async () => {
    return await MainModel.find({ status: "active" }).sort({
      ordering: -1,
    });
  };
}
module.exports = new MainService();
