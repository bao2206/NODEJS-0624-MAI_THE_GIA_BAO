const MainService = require("../services/item_service");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const { uploadImage } = require("../middleware/upload");
const nameRoute = "item";
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
      res.render(`admin/pages/${nameRoute}/form`, { item, errors: [] });
    } catch (err) {
      res.redirect(`/admin/${nameRoute}?errorMessage=Error loading form`);
    }
  };
  saveForm = [
    uploadImage("item"),
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
          imageUrl: req.file
            ? `/uploads/${nameRoute}/${req.file.filename}`
            : req.body.existingImageUrl ||
              "/uploads/default-image/default-image.jpg",
        };
        // req.flash("errorMessage", "Please correct the errors below.");
        return res.render(`admin/pages/${nameRoute}/form`, {
          item,
          errors: errors.array(),
          successMessage: "",
          errorMessage: "Please correct the errors below.",
        });
      }
      next();
    },
    async (req, res, next) => {
      try {
        const { id, name, status, ordering } = req.body;
        const imageUrl = req.file
          ? `/uploads/${nameRoute}/${req.file.filename}`
          : req.body.existingImageUrl ||
            "/uploads/default-image/default-image.jpg";

        if (id) {
          const updatedData = { name, status, ordering, imageUrl };
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
          await MainService.saveItem(name, status, ordering, imageUrl);
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

      if (item && item.imageUrl) {
        const imagePath = path.join(
          __dirname,
          `../../public/uploads/${nameRoute}`,
          item.imageUrl.split("/").pop()
        );
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          }
        });
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

      console.log(
        `Received ordering update for item ID: ${id} with new ordering: ${ordering}`
      );

      if (
        !Number.isInteger(Number(ordering)) ||
        ordering < 1 ||
        ordering > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Ordering must be an integer between 1 and 100.",
        });
      }

      const item = await MainService.getEleById(id);
      if (item) {
        await MainService.updateItemById(id, { ordering });
        return res.json({
          success: true,
          message: "Ordering updated successfully",
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "An error occurred" });
    }
  };
}

module.exports = new ItemController();
