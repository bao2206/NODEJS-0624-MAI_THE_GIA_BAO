const { response } = require("express");
const ItemService = require("../services/item_service");
// const ItemModel = require("../models/item_model");
class ItemController {
  // getAll = async (req, res, next) => {
  //   let items = await ItemService.findAll();
  //   // console.log(items);
  //   res.status(200).json(items);
  // };
  // addArr = async (req, res) => {
  //   const { name, ordering, status } = req.body;
  //   try {
  //     const newItems = await ItemService.addElement(name, ordering, status);
  //     res.status(201).json({ message: "Them thanh cong", item: newItems });
  //   } catch (error) {
  //     res.status(500).json({ message: "Them that bai", error: error.message });
  //   }
  // };
  // getById = async (req, res) => {
  //   const id = req.params.id;
  //   const item = await ItemService.getEleById(id);
  //   if (item) {
  //     res.json(item);
  //   } else {
  //     res.status(404).json({ message: "Khong tim thay" });
  //   }
  // };
  // updateById = async (req, res) => {
  //   const { id } = req.params;
  //   const updatedData = req.body;
  //   const item = await ItemService.updateEleById(id, updatedData);
  //   if (item) {
  //     res.status(201).json(item);
  //   } else {
  //     res.status(404).json({ message: "Khong co id" });
  //   }
  // };
  // deleteById = async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const item = await ItemService.deleteEleById(id);
  //     if (item) {
  //       res.status(200).json({ message: "Item deleted successfully", item });
  //     } else {
  //       res.status(404).json({ message: "Item not found" });
  //     }
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Error deleting item", error: error.message });
  //   }
  // };
  getAll = async (req, res, next) => {
    try {
      let items = await ItemService.getAllItems();
      console.log(items);
      res.render("admin/pages/item/list", { items });
    } catch (err) {
      console.log(err);
    }
  };

  getForm = (req, res, next) => {
    res.render("admin/pages/item/form");
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
      res.render("admin/pages/item/edit", { item });
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
}

module.exports = new ItemController();
