var express = require("express");
var router = express.Router();

const CategoryService = require("../../services/category_service");
const ProductService = require("../../services/product_service");
const {settings, categories} = require("../../middleware/localMiddleware");
const SliderService = require("../../services/slider_service");

router.use(settings);
router.use(categories);
// router.use(menus);
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
    const [slider, products] = await Promise.all([SliderService.getAllSliderOrdered(), ProductService.getProductIsSpecial()]);
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

    
    res.render(link, {
      layout: "frontend",
      products,
      slider,
    
    });
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

module.exports = router;
