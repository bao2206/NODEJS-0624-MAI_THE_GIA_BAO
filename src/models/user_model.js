const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "Users";
const ModelDocument = "user";
const Account = require("./account_model");
require('dotenv').config();
const userSchema = new Schema(
  {
    account:{
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },
    full_name: {type: String, required: [true, "Full name is required"]},
    phone:{type: Number, required:[true,"Phone is required"], unique: true},
    
    date_of_birth: {type: Date},
    address: {
      street: {type: String, required: true},
      city: {type: String, required: true},
      country: {type: String, required: true},
      postal_code: {type: String, required: true}
    },
    avatar: {type: String,}, 
  
  },
  { collection: ConnectionDocument, timestamps: true }
);


module.exports = mongoose.model(ModelDocument, userSchema);
