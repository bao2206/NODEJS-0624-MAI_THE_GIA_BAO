class HomepageController {
  getHomepage = (req, res, next) => {
    res.render("frontend/pages/homepage/index.ejs");
  };
}

module.exports = new HomepageController();
