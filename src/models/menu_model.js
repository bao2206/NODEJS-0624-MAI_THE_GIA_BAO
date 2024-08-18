const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "menus";
const ModelDocument = "Menu";
var slugify = require("slugify");
const menuSchema = new Schema(
  {
    //   _id: Schema.Types.UUID,
    name: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    ordering: {
      type: Number,
      min: 0,
      max: 100,
    },
    slug: { type: String, unique: true },
    // category_id: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: false,
    // },
  },
  { collection: ConnectionDocument, timestamps: true }
);
menuSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model(ModelDocument, menuSchema);
