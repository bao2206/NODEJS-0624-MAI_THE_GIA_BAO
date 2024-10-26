const MainService = require("../services/discount_service");
const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const { uploadImage } = require("../middleware/upload");
const nameRoute = "discount";
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
    body("code")
      .isLength({ min: 3 })
      .withMessage("code must be required"),
    body("description")
      .isLength({ min: 5, max: 599 })
      .withMessage("Description must be between 5 and 599"),
    body("discount_type")
      .isIn(["percentage", "fixed_amount"])
      .withMessage("Status must be either 'percentage' or 'fixed_amount'"),
    body("percentage").isInt({min: 0 , max: 100}).withMessage("Percentage must be between 0 and 100"),
    body("start_date")
    .notEmpty().withMessage("Start date is required")
    .custom((value, {req}) => {
      const inputDate = new Date(value);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      if(inputDate < today){
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
    body('end_date')
    .notEmpty().withMessage("End date is required")
    .custom((value, {req}) =>{
      const endDate = new Date(value);
      const start_date = new Date(req.body.start_date);
      if(endDate <= start_date){
        throw new Error('End date must be after the start date');
      }
      return true;
    }),
    body('minimum_order_value')
    .notEmpty().withMessage("Minimum order value is required")
    .isInt({min: 1}).withMessage("Minimum order value is higher than 0"),
    body('maximum_order_value')
    .notEmpty().withMessage("Minimum order value is required")
    .custom((value, {req}) => {
      const maximum_order_value = value;
      const minimum_order_value = req.body.minimum_order_value;
      if(minimum_order_value > maximum_order_value){
        throw new Error("Minimum order value cannot higher than maximum order value");
      }
      return true;
    }),
    body("usage_limit")
    .notEmpty().withMessage("Usage limit is required")
    .isInt({min: 1}).withMessage("Usage limit is higher than 0"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const { id, ...formData } = req.body;
        const item = {
          _id: id,
         ...formData
        };
        
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
        const { id, ...formData } = req.body;
      
        const updatedData = { id, ...formData };
        if (id) {
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
        res.json({ success: true, status: newStatus });
      } else {
        res.status(404).json({ success: false, message: "Item not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  };
  updateDiscount = async(req, res, next) => {
    try{
      const discount = req.params.discount
    } catch(error){
      
    }
  }
 
  //   try {
  //     const { id } = req.params;
  //     const { ordering } = req.body;

  //     console.log(
  //       `Received ordering update for item ID: ${id} with new ordering: ${ordering}`
  //     );

  //     if (
  //       !Number.isInteger(Number(ordering)) ||
  //       ordering < 1 ||
  //       ordering > 100
  //     ) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Ordering must be an integer between 1 and 100.",
  //       });
  //     }

  //     const item = await MainService.getEleById(id);
  //     if (item) {
  //       await MainService.updateItemById(id, { ordering });
  //       return res.json({
  //         success: true,
  //         message: "Ordering updated successfully",
  //       });
  //     } else {
  //       return res
  //         .status(404)
  //         .json({ success: false, message: "Item not found" });
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //     return res
  //       .status(500)
  //       .json({ success: false, message: "An error occurred" });
  //   }
  // };
}

module.exports = new ItemController();
