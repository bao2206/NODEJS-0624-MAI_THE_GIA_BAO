const MainService = require("../services/cart_service");

const nameRoute = "cart";


class CartController {
 
  getCart = async(req, res, next) => {
    res.render(`frontend/pages/${nameRoute}/index`, { layout: "frontend"})
  }
  
  updateDiscount = async(req, res, next) => {
    const discountCode = req.body.discountCode;
    console.log(discountCode);
    let message;
    const result = await MainService.applyDiscountToCart(discountCode);
    console.log(result);
    if(!result) message = { type: 'error', text: 'Invalid discount code.' };
    message = { type: 'success', text: 'Discount applied successfully!' };
    res.render(`frontend/pages/${nameRoute}/index`, { layout: "frontend", message})
  }
}

module.exports = new CartController();
