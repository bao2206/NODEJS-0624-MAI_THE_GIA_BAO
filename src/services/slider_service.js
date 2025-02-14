const MainModel = require("../models/slider_model");

class MainService {
  getEleById = async (id) => {
    return await MainModel.findById(id);
  };
  saveItem = async (name, ordering, status, category_id, imageUrl) => {
    await MainModel.create({
      name,
      ordering,
      status,
      imageUrl,
      category_id,
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
  // render to homepage and sort it
  getAllSliderOrdered = async () => {
    return await MainModel.find({ status: "active" })
      .populate("category_id", "slug")
      .sort({
        ordering: -1,
      });
  };
}
module.exports = new MainService();
