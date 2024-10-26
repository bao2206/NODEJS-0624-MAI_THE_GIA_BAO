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
    // rating: { type: Number, default: 0, min: 0, max: 5 },
    type_discount: {type: String, enum:["discount" , "price_discount"]},
    discount: { type: Number, default: 0, min: 0, max: 100 },
    //giam theo gia
    price_discount:{type: Number, default: 0},
    details_product: { type: String },
    // quantity: { type: Number, required: true, min: 0 },
    short_description: { type: String },
    image: { type: String },
    images: [String],
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isSpecial: {
      type: Boolean,
      default: false,
      set: (value) => value === "on" || value === true,
    },
    slug: { type: String, unique: true },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    ordering: {
      type: Number,
      min: 0,
      max: 100,
    },
    total_price_product:{
      type: Number,
    }
  },
  { collection: ConnectionDocument, timestamps: true }
);
productSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });  
  }
  // this.price = this.price || 0;
  // this.discount = this.discount || 0;
  // this.price_discount = this.price_discount || 0;
  // don't select type_discount
  this.total_price_product =  this.price;
  // type_discount = discount
  if(this.type_discount === "discount"){
    this.total_price_product = this.price - ((this.price * this.discount) / 100);
  }
  // type_discount = price_discount
  else if(this.type_discount === "price_discount"){
    this.total_price_product = this.price - ((this.price_discount / price) * 100);
  }
  next();
});
module.exports = mongoose.model(ModelDocument, productSchema);
