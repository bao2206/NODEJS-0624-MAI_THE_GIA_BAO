var express = require("express");
var router = express.Router();
const ItemController = require("../controllers/item_controllers");
// router.get("/", (req, res, next) => {
//   res.render("index", { title: "Hello World" });
// });
// router.get("/:id", (req, res, next) => {
//   // query là : ? &&
//   // params: truyền tham số vào
//   res.render("hello", { title: req.params.id });
// });

// router.get("/", (req, res, next) => {
//   const { name, id } = req.query;
//   console.log(name, id);
//   res.render("hello", { name: name, id: id });
// });

// Thêm phần tử mới
//http://localhost:3000/product/add?name=Baooo&id=2
router.post("/add", ItemController.addArr);

// Lấy tất cả các phần tử
router.get("/", ItemController.getAll);
// http://localhost:3000/product/item/id=2
router.get("/:id", ItemController.getById);
// cập nhật
router.put("/product/:id", ItemController.updateById);
// xóa
router.delete("/product/:id", ItemController.deleteById);
// Cập nhật phần tử theo id
//http://localhost:3000/product/2?name=Name
// router.put("/:id", (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const { name } = req.query;
//   const item = arr.find((item) => item.id === id);
//   if (item) {
//     item.name = name || item.name; //true false
//   }
//   res.send(arr);
// });

// Xóa phần tử theo id
//http://localhost:3000/product/2
// router.delete("/:id", (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const index = arr.findIndex((item) => item.id === id);
//   if (index !== -1) {
//     arr.splice(index, 1);
//   }
//   // arr = arr.filter((item) => item.id !== id)
//   res.send(arr);
// });

module.exports = router;
