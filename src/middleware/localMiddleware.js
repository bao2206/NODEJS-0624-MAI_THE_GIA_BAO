    // var express = require('express');
    // var router = express.Router();
const SettingService = require("../services/settings_service");
const CategoryService = require("../services/category_service");
// const ProductService = require("../services/product_service");
const SliderService = require("../services/slider_service");
const MenuService = require("../services/menu_service");
// const CartService = require("../services/cart_service");
const ProductService = require("../services/product_service");

const populateCategoriesForMenu = async(menus) =>{
    try {
        await Promise.all(
            menus.map(async(menu) =>{
                menu.categories = await CategoryService.getCategoryByMenuId(menu._id)
            })
        )
        return menus;
    } catch (error) {
        
    }
}

const slider = async(req, res, next) =>{
    try{
        const sliders =  await SliderService.getAllSliderOrdered();
        res.locals.slider =  sliders;
        next();
    } catch(error){
        console.log(error);
    }
}


const settings = async(req, res, next) =>{
    try{
        const setting = await SettingService.findIdAndChangeInfo();
        let stringParse = JSON.parse(setting.name)
        res.locals.settings = stringParse;
        next();
    }catch(error){
        console.log(error);
    }
}

const menus = async(req, res, next) =>{
    try {
        const menu = await MenuService.getAllMenuOrdered();
        await populateCategoriesForMenu(menu);
        res.locals.menus = menu;
        next();
    } catch (error) {
        console.log(error);
    }
}
const product = async(req, res, next) =>{
    try{
        const {slug} = req.params;
        res.locals.product = await ProductService.findBySlug({slug});
    } catch (error){
        console.log(error);
    }
}
const categories = async(req, res, next) =>{
    try {
        const categories = await CategoryService.getAllCategories();
        res.locals.categories = categories;
        next()
    } catch (error) {
        console.log(error)
    }
}

// const cart = async(req,res,next) =>{
//     try {
//     const cartId = "67111b160ac3cdcefc8694c0";
//     const cart = await CartService.findCartById(cartId);
//     if (!cart) {
//       throw new Error('Cart not found');
//     }
//     await cart.populate('items.productId', 'name image slug total_price_product');
//     cart.items = cart.items.map((item) => {
//       item.totalPrice = item.productId.total_price_product * item.quantity;
//       return item;
//     });
//     // cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
//     cart.totalPrice = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
//     const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
//     res.locals.cart = cart;
//     res.locals.totalQuantity = totalQuantity;
//     next();
//   } catch (error) {
//     console.error("Error in cart middleware:", error);
//     next(error);
//   }
// }
module.exports = {
    slider,
    settings,
    menus,
    categories,
 
    product,
}