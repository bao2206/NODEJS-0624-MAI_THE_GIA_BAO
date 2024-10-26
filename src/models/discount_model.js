const mongoose = require('mongoose');
const { Schema } = mongoose;
const ConnectionDocument = "Discount";
const ModelDocument = "discount";
const discountSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    discount_type: {
      type: String,
      enum: ['percentage', 'fixed_amount'],
      required: true
    },
    percentage: {
      type: Number,
      default: 0, min: 0, max: 100
    },
    fixed_amount:{
      type: Number,
      default: 0, min:0
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    minimum_order_value: {
      type: Number,
      default: 0,
      required: true
    },
    maximum_order_value: {
      type: Number,
      default: 0,
      required: true
    },
    // số voucher discount
    usage_limit: {
      type: Number,
      default: 0,
      required: true,
    },
    // số voucher đã sử dụng
    used_count: {
      type: Number,
      default: 0
    },
    // số voucher còn lại 
    remaining: {
      type: Number,
      default: 0
    },
     
    status: { type: String, enum: ["active", "inactive"], default: "inactive" },
    // applicable_to: {
    //   type: [String], 
    //   default: []
    // }
  },
  { collection: ConnectionDocument, timestamps: true },
  
);
discountSchema.pre('save',  function(next){
  // ban đầu số voucher còn lại sẽ bằng tổng số voucher sẽ có
  this.remaining =  this.usage_limit
  // nếu voucher đã được sử dụng thì số voucher còn lại sẽ được cập nhật lại
  if(this.isNew && this.used_count != null){
    this.remaining = this.usage_limit - this.used_count; 
    next();
  }
  // if(this.isNew && this.fixed_amount != null){
  //   if(this.fixed_amount > this.)
  // }
});
discountSchema.methods.validateDiscount = function(){
  const currentDate = new Date();
  if(this.status !== 'active') return {isValid: false, message: "Discount is inactive"};

  if(this.end_date < currentDate){
    return {isValid: false, message: "Discount has expired"};
  }
  
  if(this.remaining <= 0) return {isValid: false, message: "No remaining uses for this discount"};

  return {isValid: true};
}

discountSchema.methods.useDiscount = async function (){
  if(this.remaining > 0){
    this.remaining -= 1;
    this.used_count += 1;
    await this.save();
  }
}

module.exports = mongoose.model(ModelDocument, discountSchema);
