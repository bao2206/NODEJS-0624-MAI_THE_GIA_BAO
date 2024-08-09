const mongoose = require("mongoose");

const { Schema } = mongoose;

const ConnectionDocument = "categories";
const ModelDocument = "Category";
const categorySchema = new Schema(
  {
    name: { type: "String", required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    ordering: {
      type: Number,
      min: 0,
      max: 100,
    },
    icons: String,
    slug: { type: String, unique: true },
  },
  { collection: ConnectionDocument }
);
categorySchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});
module.exports = mongoose.model(ModelDocument, categorySchema);
