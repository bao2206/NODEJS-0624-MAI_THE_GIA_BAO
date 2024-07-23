class IndexController {
  getAll = (req, res, next) => {
    res.render("admin/index/index.ejs");
  };
}

module.exports = new DashboardController();
