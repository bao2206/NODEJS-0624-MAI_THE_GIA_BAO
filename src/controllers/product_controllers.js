const ProductService = require("../services/product_service");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/upload");
class ProductControllers {
  getAll = async (req, res, next) => {
    try {
      const products = await ProductService.getAllProducts();

      const countStatus = [
        {
          name: "All",
          countStatus: await ProductService.countStatus(),
          link: "all",
          class: req.query.status === "all" ? "btn-success" : "btn-default",
        },
        {
          name: "Active",
          countStatus: await ProductService.countStatus("active"),
          link: "active",
          class: req.query.status === "active" ? "btn-success" : "btn-default",
        },
        {
          name: "Inactive",
          countStatus: await ProductService.countStatus("inactive"),
          link: "inactive",
          class:
            req.query.status === "inactive" ? "btn-success" : "btn-default",
        },
      ];

      // Render tệp EJS và truyền biến products vào
      res.render("admin/pages/product/listProduct", { products, countStatus });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
  updateStatus(req, res, next) {}
  saveForm(req, res, next) {}
  getForm(req, res, next) {
    let product = null;
    res.render("admin/pages/product/formProduct", { product, errors: [] });
  }
  deleteProduct(req, res, next) {}
}

module.exports = new ProductControllers();
