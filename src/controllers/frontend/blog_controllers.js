const RSSParser = require("rss-parser");
const NodeCache = require("node-cache");
const BlogService = require("../../services/blog_service");

const parser = new RSSParser();
const rssCache = new NodeCache({ stdTTL: 300 });
class BlogFrontendController {
  static extractImage(item) {
    if (item.enclosure && item.enclosure.url) {
      return item.enclosure.url; // Lấy ảnh từ <enclosure>
    }

    const match = item.content?.match(/<img.*?src=["'](.*?)["']/);
    return match ? match[1] : "images/blog/default.jpg"; // Nếu không có ảnh, dùng ảnh mặc định
  }
  getAll = async (req, res, next) => {
    try {
      let feed = rssCache.get("rssFeed");

      // Nếu cache không có dữ liệu, lấy từ RSS
      if (!feed) {
        //   console.log("Fetching fresh RSS feed...");
        feed = await parser.parseURL(
          "https://vnexpress.net/rss/tin-moi-nhat.rss"
        );

        // Kiểm tra dữ liệu trả về từ RSS
        if (!feed || (!feed.items && !feed.item && !feed.channel?.item)) {
          // console.error("RSS Feed không hợp lệ:", feed);
          return [];
        }

        // Đảm bảo `items` tồn tại
        const items = feed.items || feed.item || feed.channel?.item || [];
        // console.log("RSS Items:", items);

        // Chuyển đổi dữ liệu RSS thành định dạng phù hợp
        feed.items = items.map((item) => ({
          title: item.title || "No Title",
          link: item.link || "#",
          pubDate: item.pubDate || new Date().toISOString(),
          image: BlogFrontendController.extractImage(item),
          contentSnippet: item.contentSnippet || "Không có mô tả.",
          guid: item.guid || "",
          isoDate: item.isoDate || "",
        }));

        rssCache.set("rssFeed", feed);
      } else {
        console.log("Serving from cache");
      }

      return feed.items || []; // Đảm bảo luôn trả về mảng

      //   return feed;
    } catch (err) {
      console.log(err);
    }
  };

  getCategoryBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
  
        // Kiểm tra nếu `slug` không tồn tại
        if (!slug) {
          return res.status(400).json({ message: "Slug is required." });
        }
  
        // Tìm link RSS từ database
        const category = await BlogService.findBySlug({ slug });
  
        if (!category || !category.link) {
          console.error(`Không tìm thấy RSS cho slug: ${slug}`);
          return res.status(404).json({ message: "RSS không tồn tại." });
        }
  
        let feed = rssCache.get(`rssFeed_${slug}`);
  
        if (!feed) {
          // console.log(`Fetching fresh RSS feed for slug: ${slug}`);
          feed = await parser.parseURL(category.link); // Gọi RSS từ link database
  
          if (!feed || (!feed.items && !feed.item && !feed.channel?.item)) {
            return res.status(404).json({ message: "Không có dữ liệu RSS." });
          }
  
          // Chuẩn hóa dữ liệu bài viết từ RSS
          const items = feed.items || feed.item || feed.channel?.item || [];
  
          feed.items = items.map((item) => ({
            title: item.title || "No Title",
            link: item.link || "#",
            pubDate: item.pubDate || new Date().toISOString(),
            image: BlogFrontendController.extractImage(item),
            contentSnippet: item.contentSnippet || "Không có mô tả.",
            guid: item.guid || "",
            isoDate: item.isoDate || "",
          }));
  
          rssCache.set(`rssFeed_${slug}`, feed);
        }
        // console.log("Feed items:", feed.items);
        // Render trang blog với dữ liệu RSS
        return res.render("frontend/pages/blog", {
          blog: feed.items || [],
          layout: "frontend",
        });
  
      } catch (err) {
      console.log(err);
    }
  };
}
module.exports = new BlogFrontendController();
