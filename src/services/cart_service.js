const MainModel = require("../models/cart_model");
const DiscountService = require("./discount_service");
const DiscountModel = require("../models/discount_model");
const ProductService = require("./product_service");
class MainService {
    // findCartById = async(id) =>{
    //    return await MainModel.findById(id);
    // }
    // updateProduct = async(id, updatedData) => {
    //     const item = await MainModel.findByIdAndUpdate(id, updatedData, {new: true})
    //     return item;
    // }
    // deleteProduct = async(id) => {
    //     return await MainModel.findByIdAndDelete(id);
    // }
    // addProductToCart = async (cartId, productId, quantity) => {
    //     const cart = await this.findCartById(cartId);
    //     if (!cart) throw new Error('Cart not found');
      
    //     // Chuyển đổi và kiểm tra số lượng sản phẩm
    //     quantity = parseInt(quantity);
    //     if (isNaN(quantity) || quantity <= 0) {
    //       throw new Error('Invalid quantity');
    //     }
      
    //     // Tìm sản phẩm trong giỏ hàng
    //     const existingProductIndex = cart.items.findIndex(
    //       (item) => item.productId.toString() === productId
    //     );
      
    //     if (existingProductIndex > -1) {
    //       const existingItem = cart.items[existingProductIndex];
      
    //       // Kiểm tra `price` của sản phẩm trước khi tính `total_payment`
    //     //   if (isNaN(existingItem.price) || existingItem.price <= 0) {
    //     //     throw new Error('Invalid price for existing product');
    //     //   }
      
    //       existingItem.quantity += quantity;
    //     //   existingItem.total_payment = existingItem.quantity * existingItem.price;
      
    //       // Kiểm tra `total_payment` sau khi tính toán
    //     //   if (isNaN(existingItem.total_payment)) {
    //     //     throw new Error('Invalid total_payment for an item');
    //     //   }
    //     } else {
    //       // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
    //       const product = await ProductService.getEleById(productId);
    //       if (!product) {
    //         throw new Error('Product not found');
    //       }
      
    //     //   const price = product.total_price_product;
    //     //   if (isNaN(price) || price <= 0) {
    //     //     throw new Error('Invalid product price');
    //     //   }
      
    //       const newItem = {
    //         productId: product._id,
    //         quantity: quantity,
    //         // price: price,
    //         // total_price_product: price,
    //         // total_payment: price * quantity,
    //       };
      
    //       // Kiểm tra `total_payment` của sản phẩm mới
    //     //   if (isNaN(newItem.total_payment)) {
    //     //     throw new Error('Invalid total_payment for new item');
    //     //   }
      
    //       cart.items.push(newItem);
    //     }
      
    //     // Tính lại `total_price_cart`
    //     // cart.total_price_cart = cart.items.reduce((total, item) => {
    //     //   if (isNaN(item.total_payment)) {
    //     //     throw new Error('Invalid total_payment for an item during total price calculation');
    //     //   }
    //     //   return total + item.total_payment;
    //     // }, 0);
      
    //     // Kiểm tra `total_price_cart` trước khi lưu
    //     // if (isNaN(cart.total_price_cart)) {
    //     //   throw new Error('Invalid total price cart calculation');
    //     // }
      
    //     // Lưu lại giỏ hàng với các thay đổi
    //     await cart.save();
      
    //     return { success: true, message: 'Product added to cart successfully.' };
    //   };
      
    applyDiscountToCart = async(discountCode) =>{
        const checkDiscountCode = await DiscountService.checkCodeDiscount(discountCode);
        if(!checkDiscountCode) return false;
    return true;
  
    }
//   updateProductQuantity = async (idCart, productId, quantity) => {
//   const cart = await this.findCartById(idCart);
//   if (!cart) throw new Error('Cart not found');

//   const item = cart.items.find(
//     (item) => item.productId.toString() === productId
//   );

//   if (!item) throw new Error('Product not found in cart');

//   // Cập nhật số lượng và tính lại tổng giá sản phẩm
//   item.quantity = quantity;
//   // item.total_payment = item.quantity * item.total_price_product;

//   // Tính lại tổng giá trị của giỏ hàng
//   // cart.total_price_cart = cart.items.reduce((total, item) => total + item.total_payment, 0);

//   await cart.save();

//   return {
//     success: true,
//     itemTotal: item.total_payment,
//     totalPrice: cart.total_price_cart,
//   };
// };

}
module.exports = new MainService();
