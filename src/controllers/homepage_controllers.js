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
      let link = "frontend/pages/homepage";
      switch (slug) {
        case "contact":
          link = "frontend/pages/contact";
          break;
        case "about-us":
          link = "frontend/pages/about";
          break;
        case "blog":
          link = "frontend/pages/blog";
          break;
      }

      res.render(link, {
        layout: "frontend",
        menus,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  };
}

module.exports = new HomepageController();
