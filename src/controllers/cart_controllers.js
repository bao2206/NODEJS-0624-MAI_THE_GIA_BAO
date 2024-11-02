const MainService = require("../services/cart_service");

// const fs = require("fs");
// const path = require("path");
// const { body, validationResult } = require("express-validator");
// const { uploadImage } = require("../middleware/upload");
const nameRoute = "cart";
const cartId = "67111b160ac3cdcefc8694c0";

class CartController {
  addCart = async(req, res, next) =>{
    const productId =  req.params.productId;
    const quantity = req.body.quantity || 1;
    const result = await MainService.addProductToCart(cartId, productId, quantity);

    if (result.success) {
      const cart = await MainService.findCartById(cartId);

  
      res.json({
        success: true,
        totalPrice: cart.total_price_cart,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      });
    } else {
      res.json({ success: false, message: result.message });
    }
  }
  getCart = async(req, res, next) => {
    const idCart =  cartId;
    const cart = await MainService.findCartById(idCart);
    //const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if(!cart) {
      return res.status(404).send('Cart not found');
    }
    // console.log(idCart, cart)
    await cart.populate('items.productId');
    res.render(`frontend/pages/${nameRoute}/index`, {cart: cart, items: cart.items, layout: "frontend"})
  }
  updateProductCart = async (req, res, next) => {
    try {
      const productId = req.params.productId;
      const quantity = parseInt(req.body.quantity);
  
      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid quantity' });
      }
  
      const idCart =  cartId;
      const result = await MainService.updateProductQuantity(idCart, productId, quantity);
  
      if (result.success) {
        res.json({
          success: true,
          itemTotal: result.itemTotal,
          totalPrice: result.totalPrice,
        });
      } else {
        res.json({ success: false, message: result.message });
      }
    } catch (error) {
      console.error('Error updating product quantity:', error);
      res.json({ success: false, message: 'An error occurred while updating the cart.' });
    }
  };
  deleteProductCart = async(req, res, next) => {
    const productId = req.params.productId;
    const cart = await MainService.findCartById(cartId);
    if (!cart) {
      return res.status(404).send('Cart not found');
    }

    // Tìm sản phẩm trong giỏ hàng
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Xóa sản phẩm khỏi giỏ hàng
      cart.items.splice(itemIndex, 1);

      // Tính lại tổng giá trị của giỏ hàng
      // cart.total_price_cart = cart.items.reduce((total, item) => {
      //   return total + item.total_payment;
      // }, 0);

      // Lưu lại các thay đổi vào giỏ hàng
      await cart.save();
    } else {
      return res.status(404).send('Product not found in cart');
    }

    // Chuyển hướng về trang trước đó
    res.redirect('back');

  }
  updateDiscount = async(req, res, next) => {
    const discountCode = req.body.discountCode;
    console.log(discountCode)
    const idCart = cartId;
    const result = await MainService.applyDiscountToCart(idCart, discountCode);
    res.json(result);
    
  }
}

module.exports = new CartController();
