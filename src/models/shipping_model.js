const mongoose = require('mongoose');
const {Schema} = mongoose;

const ConnectionDocument = "Shipping";
const ModelDocument = "shipping";

const shippingSchema = new Schema (
    {
        order_id: { 
          type: Schema.Types.ObjectId, 
          ref: 'Order', 
          required: true 
        },
        shipping_address: {
          full_name: { type: String, required: true },
          phone: { type: String, required: true },
          address: { type: String, required: true },
          city: { type: String, required: true },
          postal_code: { type: String, required: true },
          country: { type: String, required: true }
        },
        shipping_method: {
          type: String,
          enum: ['standard', 'express', 'same_day'],
          required: true
        },
        tracking_number: {
          type: String
        },
        shipping_cost: {
          type: Number,
          required: true
        },
        status: {
          type: String,
          enum: ['pending', 'shipped', 'in_transit', 'delivered', 'returned', 'canceled'],
          default: 'pending',
          required: true
        },
        shipped_at: {
          type: Date
        },
        delivered_at: {
          type: Date
        },
        notes: {
          type: String,
          maxlength: 500
        },
        carrier: {
          type: String
        },
        estimated_delivery_date: {
          type: Date
        },
        delivery_attempts: {
          type: Number,
          default: 0
        },
        delivered_by: {
          type: String
        }
      },
      { collection: ConnectionDocument, timestamps: true }
);

module.exports = mongoose.model(ModelDocument, shippingSchema);