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
      console.log(error);  
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

const user = (req, res, next) => {
    console.log(123)
    if (req.cookies.user) {// Kiểm tra thông tin user từ cookies
        const user = JSON.parse(req.cookies.user); // Giải mã cookie
        res.locals.user = user.username; 
    } else {
      res.locals.user = null; // Nếu không có user trong session, gán null cho user
    }
    next();
  };
  
module.exports = {
    slider,
    settings,
    menus,
    categories,
    user,
    product,
}