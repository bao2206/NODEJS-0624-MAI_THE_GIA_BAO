var express = require("express");
var router = express.Router();

/* GET home page. */
// router.get("/", (req, res, next) => {
//   res.render("index", { title: "Express" });
// });

router.use("/item", require("./item_router"));
module.exports = router;
