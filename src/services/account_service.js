const MainModel = require("../models/account_model");

class ModelService {
  getAllItems = async (filter) => {
    return await MainModel.find(filter);
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
  createAccount = async (username, email, password) => {
    return await MainModel.create({ username, email, password });
  };
  getUserByEmail = async ({ email }) => {
    return await MainModel.findOne({ email });
  };
  getUserByUsername = async ({ username }) => {
    return await MainModel.findOne({ username });
  };

  getUserByEmailOrUsername = async ({ emailOrUsername }) => {
    const user = await MainModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    return user;
  };
  getRoleOfUser = (user) => {
    return user.role;
  };
  getAllRoles = () => {
    return MainModel.schema.path("role").enumValues;
  };
}
module.exports = new ModelService();
