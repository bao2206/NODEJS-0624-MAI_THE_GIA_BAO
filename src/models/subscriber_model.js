const mongoose = require("mongoose");
const {Schema} = mongoose;
const ConnectionDocument = "subscriber";
const ModelDocument = "Subscriber";
const productSchema = new Schema({
    email: {type: String, required: true, unique:false},
    status: {type: String, enum:["active", "inactive"], default: "active"},
},
{collection: ConnectionDocument, timestamps: true}
);
module.exports = mongoose.model(ModelDocument, productSchema);