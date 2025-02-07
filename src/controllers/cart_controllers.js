const MainService = require("../services/cart_service");

const nameRoute = "cart";


class CartController {
 
  getCart = async(req, res, next) => {
    res.render(`frontend/pages/${nameRoute}/index`, { layout: "frontend"})
  }
  
  updateDiscount = async(req, res, next) => {
    const discountCode = req.body.discountCode;
    const result = await MainService.applyDiscountToCart(discountCode);
    if(result) {
      return res.status(200).json({success: true, message: "Apply success"});
    } else {
      return res.status(200).json({success: false, message: "Discount code is invalid"});
    }
  }
}

module.exports = new CartController();
