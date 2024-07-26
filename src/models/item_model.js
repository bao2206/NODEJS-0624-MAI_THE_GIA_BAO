const mongoose = require("mongoose");
const { Schema } = mongoose;
const ConnectionDocument = "items";
const ModelDocument = "item";
const itemSchema = new Schema(
  {
    //   _id: Schema.Types.UUID,
    name: String, // String is shorthand for {type: String}
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    ordering: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  { collection: ConnectionDocument, timestamps: true }
);

module.exports = mongoose.model(ModelDocument, itemSchema);
