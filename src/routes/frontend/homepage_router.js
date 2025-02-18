var express = require("express");
var router = express.Router();

const CategoryService = require("../../services/category_service");
const ProductService = require("../../services/product_service");
const {categories,blog} = require("../../middleware/localMiddleware");
const SliderService = require("../../services/slider_service");
// const BlogService = require("../../services/blog_service");
const BlogFrontendController = require("../../controllers/frontend/blog_controllers");
const blogrouter = require("./blog_router");
// router.use(settings);
router.use(categories);
router.use(blog);
// router.use(menus);
// router.use(user)


router.get("/:slug", async (req, res, next) => {
  const { slug } = req.params;
  const { min_price, max_price } = req.query;
  const categoriesWithSlug = await CategoryService.findBySlug({ slug });
  if (categoriesWithSlug) {
    let productQuery = {
      category_id: categoriesWithSlug._id,
      status: "active", 
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
  // lấy trang danh sách sản phẩm theo danh mục sản phẩm
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
let data = { layout: "frontend" }; // Chỉ chứa dữ liệu cần thiết

switch (slug) {
  case "contact":
    link = "frontend/pages/contact";
    break;
  case "about-us":
    link = "frontend/pages/about";
    break;
  case "blog":
    link = "frontend/pages/blog";
    const blog = await BlogFrontendController.getAll();
    data.blog = blog;
    break;
  case "cart":
    link = "frontend/pages/cart";
    break;
  default:
    // Chỉ lấy products & slider nếu ở trang homepage
    const [slider, products] = await Promise.all([
      SliderService.getAllSliderOrdered(),
      ProductService.getProductIsSpecial(),
    ]);
    data.products = products;
    data.slider = slider;
    break;
}
router.use("/blog" , blogrouter);
// Render trang với dữ liệu tối ưu
res.render(link, data);
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

module.exports = router;
