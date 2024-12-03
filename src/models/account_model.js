const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const ConnectionDocument = "Accounts";
const ModelDocument = "account";
require('dotenv').config();
const accountSchema = new Schema(
  {
    username: {type: String, required:[true,'Name is required'] , min: 0, max: 50 },
    email: {type: String, required: [true, "Email is required"], unique: true, lowercase: true},
    
    password: {type: String, required:[true,"Password is required"], min: 8},
    date_of_birth: {type: Date},
    roles: { type: String, enum: ["user", "admin"], default: "user" },
    is_active: {type: String, default: true},
    verification_token:{type: String},
  },
  { collection: ConnectionDocument, timestamps: true }
);
accountSchema.pre('save', async function(next){
  const user =  this;

  if(!user.isModified('password')) return next();

  try{
    const salt = await bcrypt.genSalt(process.env.SALT_WORK_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch(error){
    next(error);
  }
});
accountSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model(ModelDocument, accountSchema);
