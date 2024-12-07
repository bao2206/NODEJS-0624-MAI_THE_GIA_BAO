var express = require("express");
var router = express.Router();

const CategoryService = require("../../services/category_service");
const ProductService = require("../../services/product_service");
const {slider, settings, categories} = require("../../middleware/localMiddleware");
router.use(slider);
router.use(settings);

router.use(categories);
// router.use(user)


router.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;
  const { min_price, max_price } = req.query;
  const categoriesWithSlug = await CategoryService.findBySlug({ slug });
  if (categoriesWithSlug) {
    let productQuery = {
      category_id: categoriesWithSlug._id,
      status: "active",  // Sản phẩm phải có trạng thái "active"
    };

    // Nếu có giá trị min_price và max_price thì thêm vào query
    if (min_price && max_price) {
      productQuery.total_price_product = { $gte: parseFloat(min_price), $lte: parseFloat(max_price) };
    }

    const product = await ProductService.findByParam(productQuery);
    product.sort((a, b) => a.ordering - b.ordering);
    return res.render("frontend/pages/product", {
      category: categoriesWithSlug,
      product,
      layout: "frontend",
      min_price,  // Truyền giá trị min_price và max_price về frontend nếu cần
      max_price
    });
  }
  // const productId = await ProductService.
  const productWithSlug = await ProductService.findBySlug({ slug });
  if (productWithSlug) {
    return res.render("frontend/pages/detailproduct", {
      product: productWithSlug,
      layout: "frontend",
    });
  }
  next();
});
router.get("/:slug?", async (req, res, next) => {
  try {
    const { slug } = req.params;


    let link = "frontend/pages/homepage";
    const products = await ProductService.getProductIsSpecial();
    switch (slug) {
      case "contact":
        link = "frontend/pages/contact";
        break;
      case "about-us":
        link = "frontend/pages/about";
        break;
      case "blog":
        link = "frontend/pages/blog";
        break;
      case "cart":
        link = "frontend/pages/cart";
        break;
    }
    
    // console.log("User in session:", req.session.user);
    // console.log("User in res.locals:", res.locals.user);
    res.render(link, {
      layout: "frontend",
      products,
      // user: res.locals.user
      // user: res.locals.user
      // menus,
      // setting,
      // slider,

    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

module.exports = router;
