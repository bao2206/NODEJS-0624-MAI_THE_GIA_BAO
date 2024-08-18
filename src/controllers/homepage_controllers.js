const CategoryService = require("../services/category_service");
const MenuService = require("../services/menu_service");
class HomepageController {
  getHomepage = async (req, res, next) => {
    try {
      const menus = await MenuService.getAllMenuOrdered();

      for (let menu of menus) {
        menu.categories = await CategoryService.getCategoryByMenuId(menu._id);
      }

      res.render("frontend/pages/homepage", { layout: "frontend", menus });
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  };
}

module.exports = new HomepageController();
