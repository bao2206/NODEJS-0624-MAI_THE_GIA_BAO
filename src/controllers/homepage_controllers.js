const CategoryService = require("../services/category_service");
const MenuService = require("../services/menu_service");
class HomepageController {
  getHomepage = async (req, res, next) => {
    try {
      const { slug } = req.params;
      const menus = await MenuService.getAllMenuOrdered();

      for (let menu of menus) {
        menu.categories = await CategoryService.getCategoryByMenuId(menu._id);
      }
      switch (slug) {
        case "contact":
          res.render("frontend/pages/contact/index", {
            layout: "frontend/pages/contact/index",
          });
          break;
        case "about-us":
          res.render("frontend/pages/about/index", {
            layout: "frontend/pages/about/index",
            menus,
          });
          break;
        case "blog":
          res.render("frontend/pages/blog/index", {
            layout: "frontend/pages/blog/index",
          });
          break;
        default:
          res.render("frontend", {
            layout: "frontend",
            menus,
          });
          break;
      }
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  };
}

module.exports = new HomepageController();
