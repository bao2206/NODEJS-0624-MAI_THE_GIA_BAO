const CategoryService = require("../services/category_service");
const ProductService = require("../services/product_service");

class HomepageController {
  getHomepage = async (req, res, next) => {
    try {
      // Get active categories ordered by 'ordering' field in descending order
      const categories = await CategoryService.getAllCategoriesOrdered();

      // For each category, get the associated products
      for (let category of categories) {
        category.products = await ProductService.getProductsByCategoryId(
          category._id
        );
      }

      res.render("frontend/pages/homepage", { layout: "frontend", categories });
    } catch (error) {
      console.log(error);
      res.redirect("/error");
    }
  };
}

module.exports = new HomepageController();
