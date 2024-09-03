const MainService = require("../services/product_service");
const CategoryService = require("../services/category_service");
const MainModel = require("../models/product_model");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const { uploadProductImages } = require("../middleware/upload");
const nameRoute = "product";
const slugify = require("slugify");
const mongoose = require("mongoose");
class ItemController {
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
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { id, ...formData } = req.body;

        // Tạo đối tượng item từ dữ liệu cũ hoặc mới
        const oldItem = id ? await MainService.getEleById(id) : {};
        const item = {
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
        const { id, name, ...formData } = req.body;
        let productId = id || new mongoose.Types.ObjectId(); // Tạo ID mới nếu không có ID
        console.log(req.body.id);
        // Lấy thông tin sản phẩm cũ từ DB nếu có ID
        const oldItem = id ? await MainService.getEleById(id) : {};

        const image =
          req.files && req.files.image
            ? `/uploads/product/${productId}/${req.files.image[0].filename}`
            : oldItem.image || "/uploads/default-image/default-image.jpg";

        const images =
          req.files && req.files.images
            ? req.files.images.map(
                (file) => `/uploads/product/${productId}/${file.filename}`
              )
            : oldItem.images || ["/uploads/default-image/default-image.jpg"];

        // console.log("Image variable", image, images);
        const slug = slugify(name, { lower: true, strict: true });

        const isSpecial = req.body.isSpecial === "on";
        const updatedData = {
          name,
          slug,
          isSpecial,
          ...formData,
          image,
          images,
        };
        console.log(updatedData);
        if (id) {
          const item = await MainService.updateItemById(id, updatedData);
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

module.exports = new ItemController();
