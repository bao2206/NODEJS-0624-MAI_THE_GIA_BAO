    // var express = require('express');
    // var router = express.Router();
const SettingService = require("../services/settings_service");
const CategoryService = require("../services/category_service");
// const ProductService = require("../services/product_service");
const SliderService = require("../services/slider_service");
const MenuService = require("../services/menu_service");


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
module.exports = {
    slider,
    settings,
    menus,
}