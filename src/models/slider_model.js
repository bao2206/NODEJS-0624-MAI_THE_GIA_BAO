const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "sliders";
const ModelDocument = "Slider";
const productSchema = new Schema(
  {
    name: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    ordering: { type: Number, min: 0, max: 100 },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageUrl: { type: String },
  },
  { collection: ConnectionDocument, timestamps: true }
);
module.exports = mongoose.model(ModelDocument, productSchema);
