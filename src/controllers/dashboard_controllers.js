class DashboardController {
  getAll = (req, res, next) => {
    res.render("admin/pages/dashboard/index.ejs");
  };
}

module.exports = new DashboardController();
