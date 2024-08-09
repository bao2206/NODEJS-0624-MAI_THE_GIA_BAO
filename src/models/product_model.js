const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "products";
const ModelDocument = "Product";
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    brand_id: { type: Schema.Types.ObjectId, ref: "Brand" },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    details_product: { type: String },
    quantity: { type: Number, required: true },
    // object mô tả các thuộc tính
    short_description: { type: String },
    image: { type: String },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isSpecial: { type: Boolean, default: false },
  },
  { collection: ConnectionDocument, timestamps: true }
);

module.exports = mongoose.model(ModelDocument, productSchema);
