const MainService = require("../services/product_service");
const CategoryService = require("../services/category_service");
const MainModel = require("../models/product_model");
const fs = require("fs");
const path = require("path");
const { body, check,validationResult } = require("express-validator");
const { uploadProductImages } = require("../middleware/upload");
const nameRoute = "product";
const slugify = require("slugify");
const mongoose = require("mongoose");
class ProductController {
  getAll = async (req, res, next) => {
    try {
      let status = req.query.status || "all";
      let searchTerm = req.query.keyword || "";
      let filter = {};
      if (status !== "all") filter.status = status;

      let items = searchTerm
        ? await MainService.findItem(searchTerm, filter)
        : await MainService.getAllItems(filter);

      let populatedItems = await MainModel.populate(items, {
        path: "category_id",
      });

      let page = parseInt(req.query.page) || 1;
      const itemsPerPage = 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      const paginatedItems = populatedItems.slice(startIndex, endIndex);

      let countStatus = [
        {
          name: "All",
          countStatus: await MainService.countStatus(""),
          link: "",
          class: status === "all" ? "btn-success" : "btn-default",
        },
        {
          name: "Active",
          countStatus: await MainService.countStatus("active"),
          link: "active",
          class: status === "active" ? "btn-success" : "btn-default",
        },
        {
          name: "Inactive",
          countStatus: await MainService.countStatus("inactive"),
          link: "inactive",
          class: status === "inactive" ? "btn-success" : "btn-default",
        },
      ];
      let successMessage = req.query.successMessage || "";
      let errorMessage = req.query.errorMessage || "";
      // console.log(paginatedItems);
      res.render(`admin/pages/${nameRoute}/list`, {
        items: paginatedItems,
        countStatus,
        currentPage: page,
        totalPages,
        searchTerm,
        status,
        successMessage,
        errorMessage,
      });
    } catch (err) {
      console.log(err);
    }
  };

  getForm = async (req, res, next) => {
    try {
      const { id } = req.params;
      let item = {};
      if (id) {
        item = await MainService.getEleById(id);
      }

      const categories = await CategoryService.getAllCategories();

      res.render(`admin/pages/${nameRoute}/form`, {
        item,
        categories,
        errors: [],
      });
    } catch (err) {
      console.log(err);
      res.redirect(`/admin/${nameRoute}?errorMessage=Error loading form`);
    }
  };

  saveForm = [
    uploadProductImages(),
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("ordering")
      .isInt({ min: 1, max: 100 })
      .withMessage("Ordering must be between 1 and 100"),
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be greater than or equal to 0"),
    body("discount")
      .isInt({ min: 0, max: 100 })
      .withMessage("Discount must be between 0 and 100"),
    body("category_id").notEmpty().withMessage("Category must be selected"),
    check("price_discount").custom((value, {req}) =>{
      if(parseFloat(value) > parseFloat(req.body.price)){
        throw new Error("Price discount cannot be greater than price");
      } return true;
    }),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        var { id, ...formData } = req.body;

        // Tạo đối tượng item từ dữ liệu cũ hoặc mới
        const oldItem = id ? await MainService.getEleById(id) : {};
        var item = {
          _id: id,
          ...formData,
          image: req.files.image
            ? `/uploads/product/${id || "temp"}/${req.files.image[0].filename}`
            : oldItem.image || "/uploads/default-image/default-image.jpg",
          images: req.files.images
            ? req.files.images.map(
                (file) => `/uploads/product/${id || "temp"}/${file.filename}`
              )
            : oldItem.images || ["/uploads/default-image/default-image.jpg"],
        };
        const categories = await CategoryService.getAllCategories();
        return res.render(`admin/pages/${nameRoute}/form`, {
          item,
          categories,
          errors: errors.array(),
          successMessage: "",
          errorMessage: "Please correct the errors below.",
        });
      }
      next();
    },
    async (req, res, next) => {
      try {
        var { id, name,  type_discount, price_discount, discount,...formData } = req.body;
        let productId = id || new mongoose.Types.ObjectId(); 
        // console.log(req.body.id);
        
        const oldItem = id ? await MainService.getEleById(id) : {};

        const image = req.files.image
          ? `/uploads/product/${productId}/${req.files.image[0].filename}`
          : oldItem.image || "/uploads/default-image/default-image.jpg";

        const images = req.files.images
          ? req.files.images.map(
              (file) => `/uploads/product/${productId}/${file.filename}`
            )
          : oldItem.images || ["/uploads/default-image/default-image.jpg"];

        // console.log("Image variable", image, images);
        const slug = slugify(name, { lower: true, strict: true });

        
        var type_discount = req.body.type_discount;
        // console.log(type_discount)
        // console.log(type_discount);
        var price_discount = req.body.price_discount;
        var price = req.body.price;
        var discount = req.body.discount;
        if(type_discount === "discount"){
          // console.log(price_discount, discount);
          price_discount = (price * discount) / 100;
        } else if(type_discount === "price_discount"){
          discount = (price_discount / price) * 100;
        }
        var updatedData = { name, slug, ...formData, image, images, type_discount ,price_discount, discount };

        if (id) {
          var item = await MainService.updateItemById(id, updatedData);
          if (item) {
            console.log(image, images);
            return res.redirect(
              `/admin/${nameRoute}?successMessage=Item updated successfully`
            );
          } else {
            return res.redirect(
              `/admin/${nameRoute}/form?errorMessage=Cannot find item with the provided ID`
            );
          }
        } else {
          // console.log("Save product");
          // console.log(updatedData);
          // Lưu sản phẩm mới
          await MainService.saveItem(updatedData);
          return res.redirect(
            `/admin/${nameRoute}?successMessage=Item added successfully`
          );
        }
      } catch (err) {
        console.log(err);
        return res.redirect(
          `/admin/${nameRoute}/form?errorMessage=Error processing request.`
        );
      }
    },
  ];
  deleteItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await MainService.getEleById(id);

      if (item) {
        const dirPath = path.join(
          __dirname,
          `../../public/uploads/product/${id}`
        );

        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
        }
      }

      await MainService.deleteItemById(id);
      res.redirect(
        `/admin/${nameRoute}?successMessage=Item deleted successfully`
      );
    } catch (error) {
      console.log(error);
      res.redirect(`/admin/${nameRoute}?errorMessage=Error deleting item`);
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await MainService.getEleById(id);

      if (item) {
        const newStatus = item.status === "active" ? "inactive" : "active";
        await MainService.updateItemById(id, { status: newStatus });
        // req.flash("successMessage", `Item status updated to ${newStatus}`);
        res.json({ success: true, status: newStatus });
      } else {
        // req.flash("errorMessage", "Item not found");
        res.status(404).json({ success: false, message: "Item not found" });
      }
    } catch (err) {
      console.log(err);
      // req.flash("errorMessage", "Error updating status");
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  };
  updateOrdering = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { ordering } = req.body;

      if (
        !Number.isInteger(Number(ordering) || ordering < 1 || ordering > 100)
      ) {
        return res.status(400).json({
          success: false,
          message: "Ordering must be an integer between 1 and 100.",
        });
      }
      const item = await MainService.getEleById(id);
      if (item) {
        await MainService.updateItemById(id, { ordering });
        console.log("success");
        res.json({ success: true, message: "Ordering updated successfully" });
      } else {
        console.log("404");
        res.status(404).json({ success: false, message: "Item not found" });
      }
    } catch (err) {
      console.log("500");
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  };
}

module.exports = new ProductController();
