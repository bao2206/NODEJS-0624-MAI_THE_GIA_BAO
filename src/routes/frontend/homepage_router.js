var express = require("express");
var router = express.Router();
const HomepageController = require("../../controllers/homepage_controllers");
const CategoryService = require("../../services/category_service");
const ProductService = require("../../services/product_service");

router.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;
  //for category
  const categoriesWithSlug = await CategoryService.findBySlug(slug);
  if (categoriesWithSlug) {
    const products = await ProductService.findByParam({
      idCategory: categoriesWithSlug._id,
    });
    return res.render("frontend/pages/product", {
      category: categoriesWithSlug,
      products,
      layout: "frontend",
    });
  }

  //for product detail
  const productWithSlug = await ProductService.findBySlug(slug);
  if (productWithSlug) {
    return res.render("frontend/pages/detail", {
      products: productWithSlug,
      layout: "frontend",
    });
  }
  next();
});
router.get("/:slug?", HomepageController.getHomepage);
// slug switch case
module.exports = router;
