
const SettingService = require("../services/settings_service");
const CategoryService = require("../services/category_service");

const MenuService = require("../services/menu_service");
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
      next(error)  
    }
}



const settings = async(req, res, next) =>{
    try{
        const setting = await SettingService.findIdAndChangeInfo();
        let stringParse = JSON.parse(setting.name)
        res.locals.settings = stringParse;
        next();
    }catch(error){
        next(error)
    }
}

const menus = async(req, res, next) =>{
    try {
        const menu = await MenuService.getAllMenuOrdered();
        await populateCategoriesForMenu(menu);
        res.locals.menus = menu;
        next();
    } catch (error) {
        next(error)
    }
}
const product = async(req, res, next) =>{
    try{
        const {slug} = req.params;
        res.locals.product = await ProductService.findBySlug({slug});
    } catch (error){
        next(error)
    }
}
const categories = async(req, res, next) =>{
    try {
        const categories = await CategoryService.getAllCategories();
        res.locals.categories = categories;
        next()
    } catch (error) {
        next(error)
    }
}

const user = (req, res, next) => {
    if (req.cookies.user) {// Kiểm tra thông tin user từ cookies
        const user = JSON.parse(req.cookies.user); // Giải mã cookie
        res.locals.user = user.username; 
    } else {
      res.locals.user = null; // Nếu không có user trong session, gán null cho user
    }
    next();
  };
  
module.exports = {
    settings,
    menus,
    categories,
    user,
    product,
}