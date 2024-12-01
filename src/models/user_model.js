const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const ConnectionDocument = "Users";
const ModelDocument = "user";
require('dotenv').config();
const userSchema = new Schema(
  {
    //   _id: Schema.Types.UUID,
    username: {type: String, required:[true,'Name is required'] , min: 0, max: 50 },
    email: {type: String, required: [true, "Email is required"], unique: true, lowercase: true},
    full_name: {type: String, required: [true, "Full name is required"]},
    phone:{type: Number, required:[true,"Phone is required"], unique: true},
    password: {type: String, required:[true,"Password is required"], min: 8},
    date_of_birth: {type: Date},
    address: {
      street: {type: String, required: true},
      city: {type: String, required: true},
      country: {type: String, required: true},
      postal_code: {type: String, required: true}
    },
    social_accounts: {
      google: {id: String, token: String},
      facebook: {id: String, token: String}
    },
    roles: { type: String, enum: ["user", "admin"], default: "user" },
    is_active: {type: String, default: true},
    // xác định tài khoản xác thực
    is_verified: {type: String, default: false},
    //xác thực qua mail
    verification_token:{type: String},
    avatar: {type: String,}, 
    // quên mật khẩu
    resetPasswordToken: {type: String},
    // exp của token
    resetPasswordExpires: {type: Date},
    last_login: {type: Date},
    // đếm số lần thất bại
    login_attempts: {type: Number, default: 0},
    // khóa tài khoản
    locked_until: {type: Date}
  },
  { collection: ConnectionDocument, timestamps: true }
);
userSchema.pre('save', async function(next){
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
userSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword, this.password);
}

module.exports = mongoose.model(ModelDocument, userSchema);
