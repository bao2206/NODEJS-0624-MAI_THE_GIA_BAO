const ItemService = require("../../services/item_service");
// const ItemModel = require("../models/item_model");
class ItemController {
  getAll = async (req, res, next) => {
    try {
      let status = req.params.status || "all";

      let objStatus = {};
      if (status !== "all") objStatus = { status };
      let items = await ItemService.getAllItems(objStatus);
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
      console.log(items);
      res.render("admin/pages/item/list", { items, countStatus });
    } catch (err) {
      console.log(err);
    }
  };

  getForm = (req, res, next) => {
    res.render("admin/pages/item/form", { item: null });
  };
  saveForm = async (req, res, next) => {
    try {
      const { name, status, ordering } = req.body;
      await ItemService.saveUser(name, status, ordering);
      res.redirect("/admin/item");
    } catch (err) {
      console.log(err);
    }
  };
  deleteItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      await ItemService.deleteItemById(id);
      res.redirect("/admin/item");
    } catch (error) {
      console.log(error);
    }
  };
  getFormUpdateItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await ItemService.getEleById(id);
      res.render("admin/pages/item/form", { item });
    } catch (err) {
      console.log(err);
    }
  };

  updateItem = async (req, res, next) => {
    try {
      const { id, name, status, ordering } = req.body;
      // console.log("ID từ form:", id);
      const updatedData = { name, status, ordering };
      const item = await ItemService.updateItemById(id, updatedData);
      if (item) {
        res.redirect("/admin/item");
      } else {
        res.status(404).json({ message: "Cannot find id" });
      }
    } catch (err) {
      res.status(500).json({ message: "Cannot update item", err: err.message });
    }
  };
  searchItem = async (req, res, next) => {
    try {
      const searchTerm = req.query.keyword || "";
      console.log(searchTerm);
      const items = await ItemService.findItem(searchTerm);
      let countStatus = [
        {
          name: "All",
          countStatus: await ItemService.countStatus(""),
          link: "",
          class: "btn-default",
        },
        {
          name: "Active",
          countStatus: await ItemService.countStatus("active"),
          link: "active",
          class: "btn-default",
        },
        {
          name: "Inactive",
          countStatus: await ItemService.countStatus("inactive"),
          link: "inactive",
          class: "btn-default",
        },
      ];
      console.log(items);
      res.render("admin/pages/item/list", { items, countStatus });
    } catch (err) {
      res.status(500).json({ message: "No matching records found" });
    }
  };
}

module.exports = new ItemController();
