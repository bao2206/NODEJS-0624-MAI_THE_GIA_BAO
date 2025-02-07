const MainModel = require("../models/cart_model");
const DiscountService = require("./discount_service");
const DiscountModel = require("../models/discount_model");
const ProductService = require("./product_service");
class MainService {
      
    applyDiscountToCart = async(discountCode) =>{
        const checkDiscountCode = await DiscountService.checkCodeDiscount(discountCode);
        if(!checkDiscountCode) return false;
        return true;
    }
}
module.exports = new MainService();
