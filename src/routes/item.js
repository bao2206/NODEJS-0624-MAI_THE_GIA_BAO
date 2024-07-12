var express = require("express");
var router = express.Router();
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

var express = require("express");
var router = express.Router();

let arr = [
  {
    name: "Bao",
    id: 1,
  },
];

// Thêm phần tử mới
//http://localhost:3000/product/add?name=Baooo&id=2
router.post("/add", (req, res) => {
  const { name, id } = req.query;
  const newItem = { name, id: parseInt(id, 10) };
  arr.push(newItem);
  res.send(arr);
});

// Lấy tất cả các phần tử
router.get("/", (req, res) => {
  res.send(arr);
});
// http://localhost:3000/product/item?id=2
router.get("/item", (req, res) => {
  const id = parseInt(req.query.id, 10);
  const item = arr.find((item) => item.id === id);
  if (!item) {
    return res.send("Item not found");
  }
  res.send(item);
});

// Cập nhật phần tử theo id
//http://localhost:3000/product/2?name=Name
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.query;
  const item = arr.find((item) => item.id === id);
  if (item) {
    item.name = name || item.name;
  }
  res.send(arr);
});

// Xóa phần tử theo id
//http://localhost:3000/product/2
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = arr.findIndex((item) => item.id === id);
  if (index !== -1) {
    arr.splice(index, 1);
  }
  res.send(arr);
});

module.exports = router;
