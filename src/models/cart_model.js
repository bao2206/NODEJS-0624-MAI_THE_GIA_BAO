const mongoose = require('mongoose');
const { Schema } = mongoose;
const ConnectionDocument = "Cart";
const ModelDocument = "cart";
const DiscountModel = require("./discount_model");
const cartSchema = new Schema(
    {
        items: [
            {
              productId: {
                type: mongoose.Schema.Types.ObjectId, // Liên kết với Product
                ref: 'Product',
                required: true
              },
              quantity: {
                type: Number,
                required: true,
                min: 1
              },
              // price: {
              //   type: Number,
              //   // required: true
              // },
              // total_price_product: {
              //   type: Number,
              //   // required: true
              // },
              // total_payment: {
              //   type: Number
              // }
            }
          ],
        discount_id: {
            type: Schema.Types.ObjectId,
            ref: "Discount",
        }, 
        total_price_cart: {
            type: Number,
            // required: true,
        } 
    },
    { collection: ConnectionDocument, timestamps: true },
);
cartSchema.pre("save", function(next){
  try {
    let total = 0;
    // this.items.forEach(item => {
    //   item.total_payment = item.quantity * item.total_price_product;
    //   total += item.total_payment;
    // });
    this.items.forEach(item => {
      total += item.total_price_product;
    });
    if(this.discount_id){
      const discount = DiscountModel.findById(this.discount_id);
      if(discount && discount.status ==="active"){
        const currentDate = new Date();

        if(currentDate >= discount.start_date && currentDate <= discount.end_date){
          if (discount.discount_type === 'percentage' && discount.percentage > 0) {
            const discountAmount = (total * discount.percentage) / 100;
            total -= discountAmount;
          } else if (discount.discount_type === 'fixed_amount' && discount.fixed_amount > 0) {
            total -= discount.fixed_amount;
          }
        }
        if(total < 0){
          total = 0;
        }
      }
    }
    // tổng tiền thanh toán sản phẩm = số lượng sản phẩm * giá tiền 1 sản phẩm
    // this.items.total_payment = this.items.quantity * this.items.total_price_product;
    // tổng tiền thanh toán giỏ hàng
    this.total_price_cart = total;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = mongoose.model(ModelDocument, cartSchema);