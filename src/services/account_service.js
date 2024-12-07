const MainModel = require("../models/account_model");

class ModelService {
  createAccount = async (username, email, password ) =>{
    return await MainModel.create({username, email, password});
  }
  getUserByEmail = async ({email}) =>{
    return await MainModel.findOne({email}); 
  }
  getUserByUsername = async ({username}) =>{
    return await MainModel.findOne({username}); 
  }

  getUserByEmailOrUsername =  async({emailOrUsername}) => {
    const user = await MainModel.findOne({
      $or: [
        {email: emailOrUsername},
        {username: emailOrUsername}
      ]
    })
    return user;
  }
 
}
module.exports = new ModelService();
