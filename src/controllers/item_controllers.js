const ItemService = require("../services/item_service");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/upload");

class ItemController {
  getAll = async (req, res, next) => {
    try {
      let status = req.query.status || "all";
      let searchTerm = req.query.keyword || "";
      let filter = {};
      if (status !== "all") filter.status = status;

      let items = searchTerm
        ? await ItemService.findItem(searchTerm, filter)
        : await ItemService.getAllItems(filter);

      let page = parseInt(req.query.page) || 1;
      const itemsPerPage = 10;
      const totalItems = items.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      const paginatedItems = items.slice(startIndex, endIndex);

      let countStatus = [
        {
          name: "All",
          countStatus: await ItemService.countStatus(""),
          link: "",
          class: status === "all" ? "btn-success" : "btn-default",
        },
        {
          name: "Active",
          countStatus: await ItemService.countStatus("active"),
          link: "active",
          class: status === "active" ? "btn-success" : "btn-default",
        },
        {
          name: "Inactive",
          countStatus: await ItemService.countStatus("inactive"),
          link: "inactive",
          class: status === "inactive" ? "btn-success" : "btn-default",
        },
      ];
      res.render("admin/pages/item/list", {
        items: paginatedItems,
        countStatus,
        currentPage: page,
        totalPages,
        searchTerm,
        status,
      });
    } catch (err) {
      console.log(err);
    }
  };

  getForm = async (req, res, next) => {
    try {
      const { id } = req.params;
      let item = null;
      if (id) {
        item = await ItemService.getEleById(id);
      }
      res.render("admin/pages/item/form", { item, errors: [] });
    } catch (err) {
      console.log(err);
    }
  };

  saveForm = [
    upload("item"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("ordering")
      .isInt({ min: 1, max: 100 })
      .withMessage("Ordering must be between 1 and 100"),
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("Status must be either 'active' or 'inactive'"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { id, name, status, ordering } = req.body;
        const item = {
          _id: id,
          name,
          status,
          ordering,
          imageUrl: req.file ? `/uploads/item/${req.file.filename}` : "",
        };
        return res.render("admin/pages/item/form", {
          item,
          errors: errors.array(),
        });
      }
      next();
    },
    async (req, res, next) => {
      try {
        const { id, name, status, ordering } = req.body;
        const imageUrl = req.file ? `/uploads/item/${req.file.filename}` : "";
        if (id) {
          const updatedData = { name, status, ordering, imageUrl };
          const item = await ItemService.updateItemById(id, updatedData);
          if (item) {
            req.flash("successMessage", "Item updated successfully");
            res.redirect("/admin/item");
          } else {
            req.flash("errorMessage", "Cannot find item with the provided ID");
            res.redirect("/admin/item");
          }
        } else {
          await ItemService.saveItem(name, status, ordering, imageUrl);
          req.flash("successMessage", "Item added successfully");
          res.redirect("/admin/item");
        }
      } catch (err) {
        req.flash("errorMessage", "Error processing request");
        console.log(err);
        res.redirect("/admin/item");
      }
    },
  ];

  deleteItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await ItemService.getEleById(id);

      if (item && item.imageUrl) {
        const imagePath = path.join(
          __dirname,
          "../../../public/uploads/item",
          item.imageUrl.split("/").pop()
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
      }
      await ItemService.deleteItemById(id);
      req.flash("successMessage", "Item deleted successfully");
      res.redirect("/admin/item");
    } catch (error) {
      req.flash("errorMessage", "Error deleting item");
      console.log(error);
      res.redirect("/admin/item");
    }
  };

  updateStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await ItemService.getEleById(id);

      if (item) {
        const newStatus = item.status === "active" ? "inactive" : "active";
        await ItemService.updateItemById(id, { status: newStatus });
        res.json({ success: true, status: newStatus });
      } else {
        res.status(404).json({ success: false, message: "Item not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  };
}

module.exports = new ItemController();
