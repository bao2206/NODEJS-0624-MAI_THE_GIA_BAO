const ItemModel = require("../models/item_model");

class ItemService {
  getEleById = async (id) => {
    return await ItemModel.findById(id);
  };
  saveItem = async (name, status, ordering, imageUrl) => {
    console.log(name, status, ordering, imageUrl);
    await ItemModel.create({
      name,
      ordering,
      status,
      imageUrl,
    });
  };
  getAllItems = async (filter) => {
    return await ItemModel.find(filter);
  };
  deleteItemById = async (id) => {
    return await ItemModel.findByIdAndDelete(id);
  };
  updateItemById = async (id, updatedData) => {
    const item = await ItemModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    return item;
  };
  countStatus = async (name = "") => {
    //
    let status = {};
    if (name != "") status = { status: name };
    return await ItemModel.countDocuments(status);
  };
  findItem = async (searchTerm, filter) => {
    const test = await ItemModel.find({
      ...filter,
      $or: [{ name: { $regex: new RegExp(searchTerm, "ig") } }],
    });
    // console.log(searchTerm, filter, test);
    return test;
  };
}
module.exports = new ItemService();
