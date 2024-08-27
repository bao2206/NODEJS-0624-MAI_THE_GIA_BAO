const MainService = require("../services/category_service");
const MenuService = require("../services/menu_service");
const ProductService = require("../services/product_service");
const MainModel = require("../models/category_model");
const fs = require("fs");
const { uploadImage } = require("../middleware/upload");
const path = require("path");
const { body, validationResult } = require("express-validator");
const slugify = require("slugify");
const nameRoute = "category";
class MainController {
  // Method to handle GET request to list all categories
  getAll = async (req, res, next) => {
    try {
      let status = req.query.status || "all";
      let searchTerm = req.query.keyword || "";
      let filter = {};
      if (status !== "all") filter.status = status;

      let items = searchTerm
        ? await MainService.findItem(searchTerm, filter)
        : await MainService.getAllItems(filter);

      // Populate category details
      let populatedItems = await MainModel.populate(items, { path: "menu_id" });

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
      // console.log(
      //   paginatedItems,
      //   countStatus,
      //   // currentPage,
      //   totalPages,
      //   searchTerm,
      //   status,
      //   successMessage,
      //   errorMessage
      // );
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

      // Retrieve the list of active categories
      const menus = await MenuService.getAllMenu();

      res.render(`admin/pages/${nameRoute}/form`, {
        item,
        menus, // Pass categories to the view
        errors: [],
      });
    } catch (err) {
      console.log(err);
      res.redirect(`/admin/${nameRoute}?errorMessage=Error loading form`);
    }
  };

  saveForm = [
    uploadImage("item"),
    body("name")
      .isString()
      .withMessage("Name must be a valid string")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("ordering")
      .isInt({ min: 1, max: 100 })
      .withMessage("Ordering must be between 1 and 100"),
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'"),
    body("menu_id")
      .optional() // Menu ID is optional
      .isString()
      .withMessage("Menu ID must be a valid string"),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { id, name, ordering, status, menu_id } = req.body;
        const item = {
          _id: id,
          name,
          ordering,
          status,
          menu_id,
        };
        console.log("Tach item", item);
        const menus = await MenuService.getAllMenu();
        return res.render(`admin/pages/${nameRoute}/form`, {
          item,
          menus, // Ensure this is correctly populated
          errors: errors.array(),
          successMessage: "",
          errorMessage: "Please correct the errors below.",
        });
      }
      next();
    },
    async (req, res, next) => {
      try {
        const { id, name, status, ordering, menu_id } = req.body;

        // Ensure the name is treated as a string
        const validName = String(name);

        // Generate slug
        const slug = slugify(validName, { lower: true, strict: true });
        const newMenu = menu_id || null;
        const updatedData = {
          name: validName,
          slug,
          status,
          ordering,
          menu_id: menu_id || null, // Ensure menu_id is either a valid string or null
        };
        console.log("Updated data", updatedData);
        if (id) {
          // Update existing item
          const item = await MainService.updateItemById(id, updatedData);
          if (item) {
            return res.redirect(
              `/admin/${nameRoute}?successMessage=Item updated successfully`
            );
          } else {
            return res.redirect(
              `/admin/${nameRoute}/form?errorMessage=Cannot find item with the provided ID`
            );
          }
        } else {
          // Create new item
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

module.exports = new MainController();
