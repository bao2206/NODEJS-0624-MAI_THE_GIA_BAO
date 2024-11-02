var express = require("express");
var router = express.Router();
// const HomepageController = require("../../controllers/homepage_controllers");
const CategoryService = require("../../services/category_service");
const ProductService = require("../../services/product_service");
const {slider, settings,  categories} = require("../../middleware/localMiddleware");
router.use(slider);
router.use(settings);

router.use(categories);
// const populateCategoriesForMenu = async (menus) => {
//   try {
//     await Promise.all(
//       menus.map(async (menu) => {
//         menu.categories = await CategoryService.getCategoryByMenuId(menu._id);
//       })
//     );
//     return menus;
//   } catch (err) {
//     console.log(err);
//   }
// };

router.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;
  // const menus = await MenuService.getAllMenuOrdered();
  // await populateCategoriesForMenu(menus);
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
    });
  }
  // const productId = await ProductService.
  const productWithSlug = await ProductService.findBySlug({ slug });
  if (productWithSlug) {
    return res.render("frontend/pages/detailproduct", {
      products: productWithSlug,
      layout: "frontend",
      // menus,
    });
  }
  next();
});
router.get("/:slug?", async (req, res, next) => {
  try {
    const { slug } = req.params;

    // const [menus, products, slider, setting] = await Promise.all([
    //   MenuService.getAllMenuOrdered(),
    //   ProductService.getProductIsSpecial(),
    //   SliderService.getAllSliderOrdered(),
    //   SettingsService.getAllSetting()
    // ]);
    // await populateCategoriesForMenu(menus);
    let link = "frontend/pages/homepage";
    const products = await ProductService.getProductIsSpecial();
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
      case "cart":
        link = "frontend/pages/cart";
        break;
    }
    // console.log(setting);
    res.render(link, {
      layout: "frontend",
      products,
      // menus,
      // setting,
      // slider,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

module.exports = router;
