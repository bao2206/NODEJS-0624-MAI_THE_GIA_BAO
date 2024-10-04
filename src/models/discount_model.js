const mongoose = require('mongoose');
const { Schema } = mongoose;
const ConnectionDocument = "Discount";
const ModelDocument = "discount";
const discountSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'Discount code is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    discount_type: {
      type: String,
      enum: ['percentage', 'fixed_amount'],
      required: [true, 'Discount type is required']
    },
    amount: {
      type: Number,
      required: [true, 'Discount amount is required']
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required']
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required']
    },
    minimum_order_value: {
      type: Number,
      default: 0
    },
    usage_limit: {
      type: Number,
      default: null
    },
    used_count: {
      type: Number,
      default: 0
    },
    is_active: {
      type: Boolean,
      default: true
    },
    applicable_to: {
      type: [String], 
      default: []
    }
  },
  { collection: ConnectionDocument, timestamps: true }
);

module.exports = mongoose.model(ModelDocument, discountSchema);
