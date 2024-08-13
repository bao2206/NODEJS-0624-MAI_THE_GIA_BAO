const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "products";
const ModelDocument = "Product";
var slugify = require("slugify");
const productSchema = new Schema(
  {
    // thêm slugproduct
    name: { type: String, required: true },
    // brand_id: { type: Schema.Types.ObjectId, ref: "Brand" },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    details_product: { type: String },
    quantity: { type: Number, required: true, min: 0 },
    short_description: { type: String },
    image: { type: String },
    // images: [String],
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isSpecial: { type: Boolean, default: false },
    slug: { type: String, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    ordering: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { collection: ConnectionDocument, timestamps: true }
);
productSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model(ModelDocument, productSchema);
