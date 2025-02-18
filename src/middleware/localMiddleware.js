
const SettingService = require("../services/settings_service");
const CategoryService = require("../services/category_service");
const BlogService = require("../services/blog_service");
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

const populateBlogForMenu = async(menus) =>{
    try {
        await Promise.all(
            menus.map(async(menu) =>{
                menu.blog = await BlogService.getBlogByMenuId(menu._id)
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
        await populateBlogForMenu(menu);
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
        // console.log(categories);
        next()
    } catch (error) {
        next(error)
    }
}
const blog = async(req, res, next) =>{
    try {
        const blog = await BlogService.getAllBlog();
        res.locals.blog = blog;
        // console.log(blog);
        next()
    } catch (error) {
        next(error)
    }
}

const user = (req, res, next) => {
    if (req.cookies.user) {// Kiểm tra thông tin user từ cookies
        const user = JSON.parse(req.cookies.user); // Giải mã cookie
        req.user = user;
        res.locals.user = user.username;
    } else {
      res.locals.user = null; // Nếu không có user trong session, gán null cho user
      req.user = null;
    }
    next();
  };
  
module.exports = {
    settings,
    menus,
    categories,
    user,
    product,
    blog
}