var express = require("express");
var router = express.Router();
// const HomepageController = require("../../controllers/homepage_controllers");
const CategoryService = require("../../services/category_service");
const MenuService = require("../../services/menu_service");
const ProductService = require("../../services/product_service");
const populateCategoriesForMenu = async (menus) => {
  try {
    await Promise.all(
      menus.map(async (menu) => {
        menu.categories = await CategoryService.getCategoryByMenuId(menu._id);
      })
    );
    return menus;
  } catch (err) {
    console.log(err);
  }
};

router.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;
  const menus = await MenuService.getAllMenuOrdered();
  await populateCategoriesForMenu(menus);
  const categoriesWithSlug = await CategoryService.findBySlug({ slug });
  // console.log(categoriesWithSlug);
  if (categoriesWithSlug) {
    const products = await ProductService.findByParam({
      category_id: categoriesWithSlug._id,
    });
    products.sort((a, b) => a.ordering - b.ordering);
    return res.render("frontend/pages/product", {
      category: categoriesWithSlug,
      products,
      layout: "frontend",
      menus,
    });
  }
  const productWithSlug = await ProductService.findBySlug({ slug });
  if (productWithSlug) {
    return res.render("frontend/pages/detailproduct", {
      products: productWithSlug,
      layout: "frontend",
      menus,
    });
  }
  next();
});
router.get("/:slug?", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const menus = await MenuService.getAllMenuOrdered();
    await populateCategoriesForMenu(menus);
    const products = await ProductService.getProductIsSpecial();
    products.sort((a, b) => a.ordering - b.ordering);
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
      products,
      menus,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

module.exports = router;
