const ItemService = require("../services/item_service");
class ItemController {
  getAll = async (req, res, next) => {
    let items = await ItemService.findAll();
    // console.log(items);
    res.status(200).json(items);
  };
  addArr = async (req, res) => {
    const { name, ordering, status } = req.body;
    try {
      const newItems = await ItemService.addElement(name, ordering, status);
      res.status(201).json({ message: "Them thanh cong", item: newItems });
    } catch (error) {
      res.status(500).json({ message: "Them that bai", error: error.message });
    }
  };
  getById = async (req, res) => {
    const id = req.params.id;
    const item = await ItemService.getEleById(id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Khong tim thay" });
    }
  };
  updateById = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    const item = await ItemService.updateEleById(id, updatedData);
    if (item) {
      res.status(201).json(item);
    } else {
      res.status(404).json({ message: "Khong co id" });
    }
  };
  deleteById = async (req, res) => {
    const { id } = req.params;
    try {
      const item = await ItemService.deleteEleById(id);
      if (item) {
        res.status(200).json({ message: "Item deleted successfully", item });
      } else {
        res.status(404).json({ message: "Item not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting item", error: error.message });
    }
  };
}

module.exports = new ItemController();
