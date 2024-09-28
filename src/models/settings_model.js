const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = 'Settings'
const ModelDocument = "settings"

const productSchema = new Schema({
    name: String
},
{collection: ConnectionDocument, timestamps: false})
module.exports = mongoose.model(ModelDocument, productSchema)