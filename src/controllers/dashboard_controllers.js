const ProductService = require("../services/product_service");

class DashboardController {
  getAll = (req, res, next) => {
    const totalProducts = ProductService.countTotalProducts();
    res.render("admin/pages/dashboard/index.ejs", {
      totalProducts,
    });
  };
}

module.exports = new DashboardController();
