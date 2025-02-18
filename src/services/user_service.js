const MainModel = require("../models/user_model");

class ModelService {
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
  getAllItems = async (filter) => {
    return await MainModel.find(filter);
  };
  getEleById = async (id) => {
     return await MainModel.findById(id);
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
}
module.exports = new ModelService();
