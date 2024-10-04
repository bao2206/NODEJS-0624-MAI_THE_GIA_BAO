const mongoose = require('mongoose');
const {Schema} = mongoose;
const ConnectionDocument = "Orders";
const ModelDocument = "order";

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        items: [
            {
                product:{
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true,
                }
            }
        ],
        total_price: {
            type: Number,
            required: true,
        },
        promo_code: {
            type: String
        },
        discount_amount: {
            type: Number,
            default: 0,
        },
        discount_percentage:{
            type: Number,
            min: 0,
            max: 100
        },
        final_price: {
            type: Number,
            required: true,
        },
        payment_method: {
            type: String,
            enum: ['credit_card', 'paypal', 'cash_on_delivery', 'bank_transfer'],
            required: true
        },
        order_status: {
            type: String,
            enum: [
                'pending_confirmation',
                'pending_pickup',
                'pending_shipping',
                'shipped',
                'delivered',
                'returned',
                'canceled'
            ],
            default: 'pending_confirmation',
            required: true
        },
        confirmed_at: {
            type: Date
        },
        canceled_at: {
            type: Date
        },
        returned_at:{
            type: Date
        },
        delivered_at:{
            type: Date
        },
        received_at:{
            type: Date
        },
        cancel_reason:{
            type: String,
            maxlength: 1000,
        },
        payment_status:{
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        shipping_address:{
            full_name: {type: String, required: true},
            phone: {type: String, required: true},
            address: {type: String, required: true},
            city: {type: String, required: true},
            country: {type: String, required: true},
            postal_code: {type: String, required: true}
        },
        estimated_delivery_date: {
            type: Date
        }, 
        order_note: {
            type: String,
            maxlength: 1000
        }
    },
    {collection: ConnectionDocument, timestamps: true}
);
module.exports = mongoose.model(ModelDocument, orderSchema)