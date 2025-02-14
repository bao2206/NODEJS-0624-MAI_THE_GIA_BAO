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
    status: {type: String, enum: ["active", "inactive"], default: "active"},
    password: {type: String, required:[true,"Password is required"], min: 8},
    role: { type: String, enum: ["user", "admin"], default: "user" },
    is_active: {type: String, enum:["active", "inactive"], default: "active"},
    // verification_token:{type: String},
    full_name: {type: String, 
      // required: [true, "Full name is required"]
    },
    phone:{type: Number, 
      // required:[true,"Phone is required"], 
      unique: true},
    date_of_birth: {type: Date},
    address: {
      street: {type: String, 
        // required: true
        },
      city: {type: String, 
        // required: true
      },
      country: {type: String, 
        // required: true
      },
      postal_code: {type: String, 
        // required: true
      }
    },
    avatar: {type: String}, 
  },
  { collection: ConnectionDocument, timestamps: true }
);
accountSchema.pre('save', async function(next){
  const user =  this;

  if(!user.isModified('password')) return next();

  try{
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_WORK_FACTOR,10));
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
