const express = require("express");
const router = express.Router();
const BlogFrontendController = require("../../controllers/frontend/blog_controllers");

// Route lấy bài viết theo slug
router.get("/:slug", BlogFrontendController.getCategoryBySlug);

module.exports = router;